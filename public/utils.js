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
  'play'      : [254, 240, 121]
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

  // loop over each tweet creating the complete interaction. then apply
  // the interaction to the dataTree strategy. CLONE!
  tweets.forEach(function(tweet){
    var interaction = buildInteraction(tweet);

    interaction.strategies.forEach(function(interactionStrategy){
      var container = _.findWhere(dataTree.children, { variety : interactionStrategy });
      container.children.push(_.cloneDeep(interaction));
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
    var container = {
      strategies  : tweet[strategy],
      variety     : 'tweet',
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



// score the individaul tweet and pass back the total, as well as values
// for grouped fan interactions
RedThread.utils.scoreTweet = function(tweet){
  var score = { total : 0 };

  RedThread.utils.engagementTypes.forEach(function(engagementType){
    score[engagementType] = 0;

    tweet[engagementType].forEach(function(engagement){
      score[engagementType] += RedThread.calculate.score(engagementType, engagement.user);
    });

    score.total += score[engagementType];
  });

  return score;
};



// get the engagements with the highest scores, adds the score to EVERY
// engagement it looks at. Count i s the number of engagements to
// collect
RedThread.utils.getTopEngagements = function(tweet, count){
  var topEngagements = [];

  RedThread.utils.engagementTypes.forEach(function(engagementType){
    tweet[engagementType].forEach(function(engagement){
      engagement.score = RedThread.calculate.score(engagementType, engagement.user);
      engagement.type = engagementType;

      if(topEngagements.length < count) topEngagements.push(engagement);
      else{
        topEngagements = _.sortBy(topEngagements, 'score').reverse();
        if(topEngagements[count - 1].score < engagement.score){
          topEngagements.pop();
          topEngagements.push(engagement);
        }
      }
    });
  });

  return topEngagements;
};



// pass in a set of tweets and optionally a strategy if you'd like a limited
// result set.
// returns a list of scored strategies, min and max values for date, and
// the score.
RedThread.utils.scoreStrategies = function(tweets, strategy){
  var returned  = { strategies : [], dateRange : [], maxScore : 0 };
  var parseDate = d3.time.format('%d-%m-%Y').parse;

  var scoreStrategy = function(strategyName, tweet){
    // loop over the engagement types and score each engagement for either
    // the pillar or authority
    var score = 0;
    RedThread.utils.engagementTypes.forEach(function(engagementType){
      if(tweet[engagementType]){
        tweet[engagementType].forEach(function(engagement){
          score += RedThread.calculate.score(engagementType, engagement.user);
        });
      }
    });

    // fancy date formatting
    var timeSub     = tweet._id.toString().substring(0,8);
    var dateTime    = new Date(parseInt(timeSub, 16)* 1000);
    var dateString  = [
      dateTime.getDate() + 1,
      dateTime.getMonth() + 1,
      dateTime.getFullYear()
    ].join('-');
    var parsedDate  = parseDate(dateString);

    // create the container if it doesn't already exist
    if(!returned.strategies[strategyName]) returned.strategies[strategyName] = [];

    // look for an object with a matching date, if none found, add it
    var foundDateScore = _.findWhere(returned.strategies[strategyName],
      { dateString : dateString });

    if(foundDateScore) foundDateScore.score += score;
    else {
      returned.strategies[strategyName].push({
        dateString  : dateString,
        date        : parsedDate,
        score       : score
      });
    }

    // update the max score if needed
    if(score > returned.maxScore) returned.maxScore = score;

    // append the date object if not contained
    if(returned.dateRange.indexOf(parsedDate) == -1)
      returned.dateRange.push(parsedDate);
  };


  var scorePillar = function(tweet){
    tweet.pillar.forEach(function(pillarName){
      scoreStrategy(pillarName, tweet);
    });
  };

  var scoreAuthority = function(tweet){
    tweet.authority.forEach(function(authorityName){
      scoreStrategy(authorityName, tweet);
    });
  };

  // loop over the tweets, scoring either the pillars and/or authorities
  tweets.forEach(function(tweet){

    if(strategy == 'pillar') scorePillar(tweet);
    else if(strategy == 'authority') scoreAuthority(tweet);
    else {
      scorePillar(tweet);
      scoreAuthority(tweet);
    }
  });

  return returned;
};


RedThread.utils.months = ['January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December'];
RedThread.utils.engagementTypes = ['retweet', 'favorite', 'reply'];
RedThread.utils.pluralEngagementTypes = ['retweets', 'favorites', 'replies'];
RedThread.utils.strategies = {
  pillar    : ['celebrate', 'inspire', 'discover', 'create'],
  authority : ['crew', 'craft', 'style', 'music', 'play']
};
