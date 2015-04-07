// create a namespace for the current page
RedThread.page = {};



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

    html += RedThread.templates.drawer[branch.type](branch);
  });

  $('.drawer').find('.details').html(html);
};




$(function(){
  // what strategy and view model are we going to start working with?
  var strategy  = $('input[name=strategy-type]:checked').val();
  var viewModel = $('input[name=model-by]:checked').val();


  // make the key and default it to the selected strategy
  RedThread.utils.makeKey(strategy);


  // create a container for the remote data
  var tweets = null;


  // create a new instance of the sunburst and attach event handlers
  var sunburst = new RedThread.Sunburst({
    width     : $('body').width()/2.5,
    height    : $('body').width()/2.5 + 50,
    selector  : '#graphic',
    onHover   : RedThread.page.buildDrawer
  });


  // create a new instance of the time selector and attach event handlers
  var timeSelectorWidth = ($('body').width() -
    $('#controls').find('.control').outerWidth()*2);
  var timeSelector = new RedThread.TimeSelector({
    width     : timeSelectorWidth,
    height    : $('#controls').height(),
    selector  : '#time-selector',
    onChange  : function(data){
      console.log(data);
    }
  });


  // listen for change to the strategy input, make a new key
  // and redraw the sunburst
  $('.strategy-input').change(function(){
    strategy = $('input[name=strategy-type]:checked').val();
    RedThread.utils.makeKey(strategy);
    $('#graphic').html('');

    sunburst.draw({
      data : RedThread.utils.createNestedDataTreeFromTweets(tweets, strategy)
    });
  });


  // listen for changes to the view model input
  $('.view-model-input').change(function(){
    viewModel = $('input[name=model-by]:checked').val();
    sunburst.updateViewModel(viewModel);
  });


  // fetch the remote tweet data
  $.ajax({
    url : '/tweets'
  }).done(function(remoteTweets){
    tweets = remoteTweets;

    // tweets can comeback from the server a little bit incomplete
    tweets.forEach(RedThread.utils.normalizeTweet);

    // draw the sunburst and time selectors
    sunburst.draw({
      data      : RedThread.utils.createNestedDataTreeFromTweets(tweets, strategy),
      viewModel : viewModel
    });
    timeSelector.draw({
      data : RedThread.utils.scoreStrategies(tweets)
    });
  });
});
