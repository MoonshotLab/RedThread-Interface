// tweets:    an array of tweets
// strategy:  pillar or authority
var createDataTree = function(tweets, strategy){
  var dataTree = { name : 'sunburst', children : [] };

  // which kind of tree are we going to create?
  var strategyNames;
  if(strategy == 'pillar')
    strategyNames = ['celebrate', 'inspire', 'discover', 'create', 'none'];
  else
    strategyNames = ['crew', 'craft', 'style', 'music', 'play', 'none'];

  // loop over the type names and create a starter tree
  strategyNames.forEach(function(name){
    dataTree.children.push({
      variety   : name,
      type      : strategy,
      children  : []
    });
  });

  // tweets can comeback from the server a little bit incomplete
  tweets.forEach(utils.normalizeTweet);

  // loop over each tweet creating the complete interaction. then apply
  // the interaction to the dataTree strategy
  tweets.forEach(function(tweet){
    var interaction = buildInteraction(tweet);
    interaction.strategies.forEach(function(interactionStrategy){
      _.findWhere(dataTree.children, { variety : interactionStrategy })
        .children.push(interaction);
    });
  });

  // score the entire data tree model
  dataTree.children.forEach(scoreModel);
  function scoreModel(child){
    if(child.children && child.children.length)
      child.children.forEach(scoreModel);
    else if(child.type == 'interaction'){
      var score = calculate.score(child.variety, child.interaction.user);
      child.score = score;
    }
  }

  // create a detailed interaction including the container for the original
  // tweet, a breakdown of replies, favorites, and retweets,
  // and the eventual user engagement
  function buildInteraction(tweet){
    var tweetType = tweet.original.in_reply_to_status_id !== null ? 'reply' : 'tweet';
    var container = {
      strategies  : tweet[strategy],
      variety     : tweetType,
      type        : 'tweet',
      children    : [],
      original    : tweet.original
    };

    var interactionTypes = ['retweet', 'reply', 'favorite'];
    var pluralInteractionTypes = ['retweets', 'replies', 'favorites'];
    interactionTypes.forEach(function(interactionType, i){
      var interactionGroup = {
        variety   : pluralInteractionTypes[i],
        type      : 'interactionGroup',
        original  : tweet.original,
        children  : []
      };
      container.children.push(interactionGroup);
      tweet[interactionType].forEach(function(interaction){
        interactionGroup.children.push({
          variety     : interactionType,
          type        : 'interaction',
          original    : tweet.original,
          interaction : interaction
        });
      });
    });

    return container;
  }

  return dataTree;
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
      data    : createDataTree(data, 'pillar')
    });
  });
});


var templates = {};

templates.interaction = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(value*100)/100 %></h3>',
    '<h2><%= variety %></h2>',
  '</header>',
  '<section class="why">',
    '<p class="tweet"><%= original.text %></p>',
  '</section>',
  '<% if(interaction.text){ %>',
    '<section class="what">',
      '<p class="tweet"><%= interaction.text %></p>',
    '</section>',
  '<% } %>',
  '<section class="who">',
    '<ul>',
      '<li>',
        '<span class="key">Who:</span>',
        '<span class="value">',
          '<a target="blank" href="http://twitter.com/<%= interaction.user.screen_name %>">',
            '<%= interaction.user.screen_name %>',
          '</a>',
        '</span>',
      '</li>',
      '<li>',
        '<span class="key">Followers:</span>',
        '<span class="value"><%= interaction.user.followers_count %></span>',
      '</li>',
      '<li>',
        '<span class="key">Following:</span>',
        '<span class="value"><%= interaction.user.friends_count %></span>',
      '</li>',
      '<li>',
        '<span class="key">Total Statuses:</span>',
        '<span class="value"><%= interaction.user.statuses_count %></span>',
      '</li>',
    '</ul>',
  '</section>',
].join(''));


templates.interactionGroup = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(value*100)/100 %></h3>',
    '<h2><%= variety %></h2>',
  '</header>',
  '<section class="why">',
    '<p class="tweet"><%= original.text %></p>',
  '</section>',
].join(''));


templates.tweet = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(value*100)/100 %></h3>',
    '<h2><%= variety %></h2>',
  '</header>',
  '<section class="why">',
    '<p class="tweet"><%= original.text %></p>',
  '</section>',
].join(''));


templates.authority = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(value*100)/100 %></h3>',
    '<h2>Authority <span class="small"><%= name %></span></h2>',
  '</header>'
].join(''));


templates.pillar = _.template([
  '<header>',
    '<h3 class="score"><%= Math.round(value*100)/100 %></h3>',
    '<h2><%= variety %></h2>',
  '</header>'
].join(''));
