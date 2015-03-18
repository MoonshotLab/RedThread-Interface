var prepareTweetData = function(tweets){

  var tweetTemplate = [
    { 'name' : 'retweet',  'plural' : 'retweets',   'type' : 'interactionType', 'score' : 0, 'children' : [] },
    { 'name' : 'reply',    'plural' : 'replies',    'type' : 'interactionType', 'score' : 0, 'children' : [] },
    { 'name' : 'favorite', 'plural' : 'favorites',  'type' : 'interactionType', 'score' : 0, 'children' : [] }
  ];

  var authorityTemplate = [
    { 'name' : 'crew',  'type' : 'authority', 'score' : 0, 'children' : [] },
    { 'name' : 'craft', 'type' : 'authority', 'score' : 0, 'children' : [] },
    { 'name' : 'style', 'type' : 'authority', 'score' : 0, 'children' : [] },
    { 'name' : 'music', 'type' : 'authority', 'score' : 0, 'children' : [] },
    { 'name' : 'play',  'type' : 'authority', 'score' : 0, 'children' : [] },
    { 'name' : 'none',  'type' : 'authority', 'score' : 0, 'children' : [] }
  ];

  var sunburstData = {
    name      : 'sunburst',
    score     : 0,
    children  : [
      { 'name' : 'celebrate', 'type' : 'pillar', 'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'inspire',   'type' : 'pillar', 'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'discover',  'type' : 'pillar', 'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'create',    'type' : 'pillar', 'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'none',      'type' : 'pillar', 'score' : 0, 'children' : _.cloneDeep(authorityTemplate) }
    ]
  };


  // tweets can come from the server with missing data
  // ensures all required properties exist and if not, gives
  // them a default property if necessary
  var normalizeTweet = function(tweet){
    if(!tweet.pillar)     tweet.pillar    = [];
    if(!tweet.authority)  tweet.authority = [];
    if(!tweet.retweet)    tweet.retweet   = [];
    if(!tweet.reply)      tweet.reply     = [];
    if(!tweet.favorite)   tweet.favorite  = [];

    if(!tweet.pillar.length) tweet.pillar = ['none'];
    if(!tweet.authority.length) tweet.authority = ['none'];

    return tweet;
  };

  var createInteractions = function(tweet){
    var template = _.cloneDeep(tweetTemplate);
    template.forEach(function(item){
      var category = item;
      var interactionType = item.name;
      item.data = { tweet : tweet.original };

      tweet[interactionType].forEach(function(interaction){
        var score = calculate.score(item.name, interaction.user);
        category.score += score;

        category.children.push({
          name  : item.name,
          type  : 'interaction',
          score : score,
          data  : {
            interaction : interaction,
            tweet       : tweet.original
          }
        });
      });
    });

    template.forEach(function(item){
      item.children.forEach(function(child){
        child.percent = child.score/item.score;
      });
    });

    return template;
  };

  var createAuthorities = function(tweet, pillar){
    // console.log(tweet);
    tweet.authority.forEach(function(authorityName){
      var authority = _.findWhere(pillar.children, { name : authorityName });
      var interactions = createInteractions(tweet);
      interactions.forEach(function(interaction){
        authority.score += interaction.score;
        authority.children.push(interaction);
      });
      interactions.forEach(function(interaction){
        interaction.percent = interaction.score/authority.score;
      });
    });
  };

  tweets.forEach(function(tweet){
    normalizeTweet(tweet);
    tweet.pillar.forEach(function(pillarName){
      var pillar = _.findWhere(sunburstData.children, { name : pillarName });
      createAuthorities(tweet, pillar);
    });
  });

  // total pillar score
  sunburstData.children.forEach(function(pillar){
    pillar.children.forEach(function(authority){
      pillar.score += authority.score;
    });
  });

  // get authority percent
  var pillarsTotal = 0;
  sunburstData.children.forEach(function(pillar){
    pillarsTotal += pillar.score;
    pillar.children.forEach(function(authority){
      authority.percent = authority.score / pillar.score;
    });
  });

  // get pillar pecent
  sunburstData.children.forEach(function(pillar){
    pillar.percent = pillar.score/pillarsTotal;
  });

  return sunburstData;
};


$(function(){
  var $drawer = $('.drawer');
  var sunburst = new Sunburst({
    onHover : function(data){
      if(data.type) $drawer.html(templates[data.type](data));
    }
  });

  $.ajax({
    url : '/tweets'
  }).done(function(data){
    sunburst.create({
      width   : 600,
      height  : 650,
      data    : prepareTweetData(data)
    });
  });
});


var templates = {};

templates.interaction = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(score*100)/100 %></h3>',
    '<h2>Interaction <span class="small"><%= name %></span></h2>',
  '</header>',
  '<section class="why">',
    '<p class="tweet"><%= data.tweet.text %></p>',
  '</section>',
  '<% if(data.interaction.text){ %>',
    '<section class="what">',
      '<p class="tweet"><%= data.interaction.text %></p>',
    '</section>',
  '<% } %>',
  '<section class="who">',
    '<ul>',
      '<li>',
        '<span class="key">Who:</span>',
        '<span class="value">',
          '<a target="blank" href="http://twitter.com/<%= data.interaction.user.screen_name %>">',
            '<%= data.interaction.user.screen_name %>',
          '</a>',
        '</span>',
      '</li>',
      '<li>',
        '<span class="key">Followers:</span>',
        '<span class="value"><%= data.interaction.user.followers_count %></span>',
      '</li>',
      '<li>',
        '<span class="key">Following:</span>',
        '<span class="value"><%= data.interaction.user.friends_count %></span>',
      '</li>',
      '<li>',
        '<span class="key">Total Statuses:</span>',
        '<span class="value"><%= data.interaction.user.statuses_count %></span>',
      '</li>',
    '</ul>',
  '</section>',
].join(''));


templates.interactionType = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(score*100)/100 %></h3>',
    '<h2>Interaction <span class="small"><%= plural %></span></h2>',
  '</header>',
  '<section class="why">',
    '<p class="tweet"><%= data.tweet.text %></p>',
  '</section>',
].join(''));


templates.authority = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(score*100)/100 %></h3>',
    '<h2>Authority <span class="small"><%= name %></span></h2>',
  '</header>'
].join(''));


templates.pillar = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(score*100)/100 %></h3>',
    '<h2>Pillar <span class="small"><%= name %></span></h2>',
  '</header>'
].join(''));


templates.drawer = _.template([
  '<h2><%= Math.round(score*100)/100 %></h2>',
  '<h3><%= name %></h3>',
  '<% if(data && data.interaction){ %>',
    '<ul class="interaction">',
      '<li>',
        '<span class="key">Time:</span>',
        '<span class="value"><%= new Date(data.interaction.created_at) %></span>',
      '</li>',
      '<li>',
        '<span class="key">Tweet:</span>',
        '<span class="value"><%= data.interaction.text %></span>',
      '</li>',
    '</ul>',
  '<% } %>'
].join(''));
