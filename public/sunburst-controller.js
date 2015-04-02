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
      type      : 'strategy',
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

  // score the data tree model by assiging a score to the final engagement
  dataTree.children.forEach(scoreModel);
  function scoreModel(child){
    if(child.children && child.children.length)
      child.children.forEach(scoreModel);
    else if(child.type == 'engagement'){
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
      type        : 'action',
      children    : [],
      original    : tweet.original
    };

    utils.engagementTypes.forEach(function(engagementType, i){
      var engagementGroup = {
        variety       : utils.engagementTypes[i],
        type          : 'engagementGroup',
        humanVariety  : utils.pluralEngagementTypes[i],
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


$(function(){

  // create a new instance of the sunburst and attach event handlers
  var $details = $('.drawer').find('.details');
  var sunburst = new Sunburst({ onHover : buildDrawer });

  // make the key and default it to pillar
  makeKey('pillar');

  // listen for change to the strategy input and make a new key
  // and redraw the sunburst
  $('.strategy-input').change(function(){
    var val = $('input[name=strategy-type]:checked').val();
    makeKey(val);
    $('#graphic').html('');
    sunburst.create({
      width   : 600,
      height  : 650,
      data    : createDataTree(remoteData, val)
    });
  });

  var remoteData;
  $.ajax({
    url : '/tweets'
  }).done(function(tweets){
    remoteData = tweets;
    sunburst.create({
      width   : 600,
      height  : 650,
      data    : createDataTree(tweets, 'pillar')
    });

    makeTimeSelector(tweets);
  });
});



var buildDrawer = function(data, pieSize){
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
      utils.colorScheme[tree.strategy].join(','),
      ',',
      (tree.branches.length - (branch.depth-1))/tree.branches.length,
      ')'
    ].join('');

    html += templates[branch.type](branch);
  });

  $('.drawer').find('.details').html(html);
};



// makes key
var makeKey = function(strategy){
  var keyList;
  var pillars = ['celebrate', 'inspire', 'discover', 'create', 'none'];
  var authorities = ['crew', 'craft', 'style', 'music', 'play', 'none'];

  if(strategy == 'pillar') keyList = pillars;
  else keyList = authorities;

  var keys = [];
  keyList.forEach(function(key){
    keys.push({
      color : 'rgb(' + utils.colorScheme[key].join(',') + ')',
      value : key
    });
  });

  $('#key').html(templates.key({ keys : keys }));
};



// some templates and stuff
var templates = {};

templates.strategy = _.template([
  '<section class="strategy">',
    '<div style="background-color:<%= color %>" class="flag"></div>',
    '<div class="content">',
      '<div class="score">',
        '<span class="percent"><%= percent %>%</span>',
        '<span class="points"><%= Math.round(score) %></span>',
      '</div>',
      '<span class="key"><%= type %></span>',
      '<span class="value"><%= variety %></span>',
    '</div>',
  '</section>'
].join(''));

templates.action = _.template([
  '<section class="action">',
    '<div style="background-color:<%= color %>" class="flag"></div>',
    '<div class="content">',
      '<div class="score">',
        '<span class="percent"><%= percent %>%</span>',
        '<span class="points"><%= Math.round(score) %></span>',
      '</div>',
      '<span class="key">Brand Action</span>',
      '<span class="value"><%= variety %></span>',
    '</div>',
    '<div class="tweet"><%= original.text %></div>',
  '</section>'
].join(''));

templates.engagementGroup = _.template([
  '<section class="engagement-group">',
    '<div style="background-color:<%= color %>" class="flag"></div>',
    '<div class="content">',
      '<div class="score">',
        '<span class="percent"><%= percent %>%</span>',
        '<span class="points"><%= Math.round(score * 100) / 100 %></span>',
      '</div>',
      '<span class="key">Fan Action</span>',
      '<span class="value"><%= variety %></span>',
    '</div>',
  '</section>'
].join(''));

templates.engagement = _.template([
  '<section class="engagement">',
    '<div style="background-color:<%= color %>" class="flag"></div>',
    '<div class="content">',
      '<div class="score">',
        '<span class="percent"><%= percent %>%</span>',
        '<span class="points"><%= Math.round(score * 100) / 100 %></span>',
      '</div>',
      '<ul class="user-details">',
        '<li>',
          '<span class="key">Who</span>',
          '<span class="value">',
            '<a target="blank" href="http://twitter.com/<%= interaction.user.screen_name %>">',
              '<%= interaction.user.screen_name %>',
            '</a>',
          '</span>',
        '</li>',
        '<li>',
          '<span class="key">Followers</span>',
          '<span class="value"><%= interaction.user.followers_count %></span>',
        '</li>',
        '<li>',
          '<span class="key">Following</span>',
          '<span class="value"><%= interaction.user.friends_count %></span>',
        '</li>',
        '<li>',
          '<span class="key">Total Statuses</span>',
          '<span class="value"><%= interaction.user.statuses_count %></span>',
        '</li>',
      '</ul>',
    '</div>',
    '<div class="tweet"><%= interaction.text %></div>',
  '</section>'
].join(''));

templates.key = _.template([
  '<% keys.forEach(function(key){ %>',
    '<li>',
      '<span class="key" style=background-color:<%= key.color %>></span>',
      '<span class="value"><%= key.value %></span>',
    '</li>',
  '<% }) %>',
].join(''));
