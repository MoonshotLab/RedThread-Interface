var prepareTweetData = function(tweets){

  var authorityTemplate = [
    { 'name' : 'crew',  'children' : [] },
    { 'name' : 'craft', 'children' : [] },
    { 'name' : 'style', 'children' : [] },
    { 'name' : 'music', 'children' : [] },
    { 'name' : 'play',  'children' : [] },
    { 'name' : 'none',  'children' : [] }
  ];

  var obj = {
    name      : 'flare',
    children  : [
      { 'name' : 'celebrate', 'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'inspire',   'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'discover',  'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'create',    'children' : _.cloneDeep(authorityTemplate) },
      { 'name' : 'none',      'children' : _.cloneDeep(authorityTemplate) }
    ]
  };

  var findPillar = function(name){
    if(!name) name = 'none';
    return _.findWhere(obj.children, { name : name });
  };

  var addToAuthorities = function(tweet, pillar){
    tweet.authority.forEach(function(authorityName){
      var authority = _.findWhere(pillar.children, { name : authorityName });
      authority.children.push({ name : tweet.original.text });
    });
  };

  tweets.forEach(function(tweet){
    if(!tweet.pillar)    tweet.pillar    = [];
    if(!tweet.authority) tweet.authority = [];

    if(!tweet.pillar.length)
      addToAuthorities(tweet, findPillar());
    else {
      tweet.pillar.forEach(function(pillarName){
        addToAuthorities(tweet, findPillar(pillarName));
      });
    }
  });

  return obj;
};


$(function(){
  var sunburst  = new Sunburst();
  $.ajax({
    url : '/tweets'
  }).done(function(data){
    sunburst.create({
      width   : 960,
      height  : 700,
      data    : prepareTweetData(data)
    });
  });
});
