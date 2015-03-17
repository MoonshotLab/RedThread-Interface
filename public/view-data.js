var prepareTweetData = function(tweets){

  var tweetTemplate = [
    { 'name' : 'retweet',  'score' : 0, 'children' : [] },
    { 'name' : 'reply',    'score' : 0, 'children' : [] },
    { 'name' : 'favorite', 'score' : 0, 'children' : [] }
  ];

  var authorityTemplate = [
    { 'name' : 'crew',  'score' : 0, 'children' : [] },
    { 'name' : 'craft', 'score' : 0, 'children' : [] },
    { 'name' : 'style', 'score' : 0, 'children' : [] },
    { 'name' : 'music', 'score' : 0, 'children' : [] },
    { 'name' : 'play',  'score' : 0, 'children' : [] },
    { 'name' : 'none',  'score' : 0, 'children' : [] }
  ];

  var sunburstData = {
    name      : 'sunburst',
    children  : [
      { 'name' : 'celebrate', 'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'inspire',   'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'discover',  'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'create',    'score' : 0, 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'none',      'score' : 0, 'children' : _.cloneDeep(authorityTemplate) }
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

      tweet[interactionType].forEach(function(interaction){
        var score = calculate.score(item.name, interaction.user);
        category.score += score;

        category.children.push({
          name  : score.toString() + '-' + interaction.user.screen_name,
          score : score
        });
      });
    });

    return template;
  };

  var createAuthorities = function(tweet, pillar){
    tweet.authority.forEach(function(authorityName){
      var authority = _.findWhere(pillar.children, { name : authorityName });
      var interactions = createInteractions(tweet);
      interactions.forEach(function(interaction){
        authority.score += interaction.score;
        authority.children.push(interaction);
      });

      pillar.score += authority.score;
    });
  };

  tweets.forEach(function(tweet){
    normalizeTweet(tweet);
    tweet.pillar.forEach(function(pillarName){
      var pillar = _.findWhere(sunburstData.children, { name : pillarName });
      createAuthorities(tweet, pillar);
    });
  });

  return sunburstData;
};


$(function(){
  var sunburst  = new Sunburst();
  $.ajax({
    url : '/tweets'
  }).done(function(data){
    sunburst.create({
      width   : 960,
      height  : 800,
      data    : prepareTweetData(data)
    });
  });
});
