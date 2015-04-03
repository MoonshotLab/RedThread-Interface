// create a namespace for the current page
RedThread.page = {};


// pass in a set of tweets and a list of scored strategies will be returned
// as well as min and max values for data and score
RedThread.page.scoreStrategies = function(tweets){
  var returned  = { strategies : [], dateRange : [], maxScore : 0 };
  var parseDate = d3.time.format('%d-%m-%Y').parse;

  var scoreStrategy = function(strategyName, tweet){
    // loop over the engagement types and score each engagement for either
    // the pillar or authority
    var score = 0;
    RedThread.utils.engagementTypes.forEach(function(engagementType){
      tweet[engagementType].forEach(function(engagement){
        score += RedThread.calculate.score(engagementType, engagement.user);
      });
    });

    // fancy date formatting
    var timestamp   = tweet._id.toString().substring(0,8);
    var dateTime    = new Date( parseInt( timestamp, 16 ) * 1000 );
    var dateString  = [
      dateTime.getDay() + 1,
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

  // loop over the tweets, scoring the pillars and authorities
  tweets.forEach(function(tweet){
    tweet.pillar.forEach(function(pillarName){
      scoreStrategy(pillarName, tweet);
    });
    tweet.authority.forEach(function(authorityName){
      scoreStrategy(authorityName, tweet);
    });
  });

  return returned;
};


// build the data drawer
RedThread.page.buildDrawer = function(data, pieSize){
  var html = '';
  var tree = { strategy : null, branches : []};

  // recursively add branches to the data tree
  var addToTree = function(branch){
    var percent = (branch.value/pieSize)*100;
    tree.branches.push({
      type        : branch.type,
      variety     : branch.variety,
      interaction : branch.interaction,
      original    : branch.original,
      depth       : branch.depth,
      score       : branch.value,
      percent     : Math.round(percent*100)/100
    });

    if(branch.depth == 1) tree.strategy = branch.variety;
    if(branch.depth > 1) addToTree(branch.parent);
  };
  if(data.depth) addToTree(data);

  // reverse the tree
  tree.branches.reverse();

  // discover the color and apply a faded variety to each branch
  // since we're looping, make the html template
  tree.branches.forEach(function(branch){
    branch.color = [
      'rgba(',
      RedThread.utils.colorScheme[tree.strategy].join(','),
      ',',
      (tree.branches.length - (branch.depth-1))/tree.branches.length,
      ')'
    ].join('');

    html += RedThread.templates[branch.type](branch);
  });

  $('.drawer').find('.details').html(html);
};




$(function(){

  // create a container for the remote data
  var tweets = null;

  // create a new instance of the sunburst and attach event handlers
  var sunburst = new RedThread.Sunburst({
    width     : 600,
    height    : 650,
    onHover   : RedThread.page.buildDrawer
  });

  // create a new instance of the time selector and attach event handlers
  var timeSelector = new RedThread.TimeSelector({
    width     : 1380,
    height    : 75,
    onChange  : function(data){
      console.log(data);
    }
  });

  // make the key and default it to pillar
  RedThread.utils.makeKey('pillar');

  // listen for change to the strategy input, make a new key
  // and redraw the sunburst
  $('.strategy-input').change(function(){
    var val = $('input[name=strategy-type]:checked').val();
    RedThread.utils.makeKey(val);
    $('#graphic').html('');
    sunburst.draw({
      data : RedThread.utils.createNestedDataTreeFromTweets(tweets, val)
    });
  });

  // fetch the remote tweet data and create the sunburst as well as the
  $.ajax({
    url : '/tweets'
  }).done(function(remoteTweets){
    tweets = remoteTweets;

    // draw the sunburst and time selectors
    sunburst.draw({
      data : RedThread.utils.createNestedDataTreeFromTweets(tweets, 'pillar')
    });
    timeSelector.draw({
      data : RedThread.page.scoreStrategies(tweets)
    });
  });
});
