RedThread.utils = {};

// tweets can come from the server with missing data
// ensures all required properties exist and if not, gives
// them a default property if necessary
RedThread.utils.normalizeTweet = function(tweet){
  if(!tweet.pillar)     tweet.pillar    = [];
  if(!tweet.authority)  tweet.authority = [];
  if(!tweet.retweet)    tweet.retweet   = [];
  if(!tweet.reply)      tweet.reply     = [];
  if(!tweet.favorite)   tweet.favorite  = [];

  if(!tweet.pillar.length)    tweet.pillar = ['none'];
  if(!tweet.authority.length) tweet.authority = ['none'];

  return tweet;
};


// define an rgb strategy based color scheme
RedThread.utils.colorScheme = {
  'default'   : [0, 0, 0],
  'celebrate' : [76, 253, 89],
  'inspire'   : [191, 74, 251],
  'discover'  : [252, 71, 195],
  'create'    : [254, 240, 121],
  'crew'      : [114, 164, 252],
  'craft'     : [76, 253, 89],
  'style'     : [191, 74, 251],
  'music'     : [252, 71, 195],
  'play'      : [254, 240, 121],
  'none'      : [118, 250, 254],
};



// creates a nested data tree from tweets based on strategy for pillars,
// strategy for authorities, brand actions, and the final fan action
// tweets:    an array of tweets
// strategy:  pillar or authority
RedThread.utils.createNestedDataTreeFromTweets = function(tweets, strategy){
  var dataTree = { name : 'sunburst', children : [] };

  // loop over the strategy names and create a starter tree
  RedThread.utils.strategies[strategy].forEach(function(name){
    dataTree.children.push({
      variety   : name,
      type      : 'strategy',
      children  : []
    });
  });

  // tweets can comeback from the server a little bit incomplete
  tweets.forEach(RedThread.utils.normalizeTweet);

  // loop over each tweet creating the complete interaction. then apply
  // the interaction to the dataTree strategy
  tweets.forEach(function(tweet){
    var interaction = buildInteraction(tweet);
    interaction.strategies.forEach(function(interactionStrategy){
      _.findWhere(dataTree.children, { variety : interactionStrategy })
        .children.push(interaction);
    });
  });

  // score the data tree model by assiging a score to the final engagement
  dataTree.children.forEach(scoreModel);
  function scoreModel(child){
    if(child.children && child.children.length)
      child.children.forEach(scoreModel);
    else if(child.type == 'engagement'){
      var score = RedThread.calculate.score(child.variety, child.interaction.user);
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
      type        : 'action',
      children    : [],
      original    : tweet.original
    };

    RedThread.utils.engagementTypes.forEach(function(engagementType, i){
      var engagementGroup = {
        variety       : RedThread.utils.engagementTypes[i],
        type          : 'engagementGroup',
        humanVariety  : RedThread.utils.pluralEngagementTypes[i],
        humanType     : 'Engagement Group',
        original      : tweet.original,
        children      : []
      };

      container.children.push(engagementGroup);
      tweet[engagementType].forEach(function(engagement){
        engagementGroup.children.push({
          variety       : engagementType,
          type          : 'engagement',
          original      : tweet.original,
          interaction   : engagement
        });
      });
    });

    return container;
  }

  return dataTree;
};



// build a color coded key showcasing either authorities or pillars
// automaticall writes do a dom object
// strategy = 'pillar' or 'authority'
RedThread.utils.makeKey = function(strategy){
  var keys = [];

  RedThread.utils.strategies[strategy].forEach(function(key){
    keys.push({
      color : 'rgb(' + RedThread.utils.colorScheme[key].join(',') + ')',
      value : key
    });
  });

  $('#key').html(RedThread.templates.key({ keys : keys }));
};



RedThread.utils.engagementTypes = ['retweet', 'favorite', 'reply'];
RedThread.utils.pluralEngagementTypes = ['retweets', 'replies', 'favorites'];
RedThread.utils.strategies = {
  pillar    : ['celebrate', 'inspire', 'discover', 'create', 'none'],
  authority : ['crew', 'craft', 'style', 'music', 'play', 'none']
};
