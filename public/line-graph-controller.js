// create a namespace for the current page
RedThread.page = {};




$(function(){
  // what strategy are we going to start working with?
  var strategyInput = $('input[name=strategy-type]:checked').val();


  // draw the line graph and time selector
  var drawGraphs = function(strategy){
    $('#graphic').html('');
    $('#time-selector').html('');

    var scored    = RedThread.utils.scoreStrategiesByDate(tweets, strategy);
    var keyScore  = RedThread.utils.scoreStrategiesByDate(tweets);
    lineGraph.draw({    data : scored });
    timeSelector.draw({ data : scored });

    RedThread.utils.makeKey(strategy, keyScore);
  };


  // start the controls, listen for change
  RedThread.controls.init({
    strategyChange : drawGraphs
  });


  // create a container for the remote data
  var tweets = null;


  // create a new instance of the line graph
  var graphHeight = ($('body').height() -
    $('#nav').height() -
    $('#controls').height() - 50
  );
  var lineGraph = new RedThread.LineGraph({
    selector  : '#graphic',
    width     : $('body').width(),
    height    : graphHeight
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


  // fetch the remote tweet data and create the line graph as well as the
  $.ajax({
    url : '/tweets'
  }).done(function(remoteTweets){
    tweets = remoteTweets;

    // tweets can comeback from the server a little bit incomplete
    tweets.forEach(RedThread.utils.normalizeTweet);

    // draw time selector and line graph
    drawGraphs(strategyInput);
  });

});
