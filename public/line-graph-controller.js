$(function(){

  // make the key and default it to pillar
  RedThread.utils.makeKey('pillar');

  // fetch the remote tweet data and create the sunburst as well as the
  $.ajax({
    url : '/tweets'
  }).done(function(tweets){

    // tweets can comeback from the server a little bit incomplete
    tweets.forEach(RedThread.utils.normalizeTweet);

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

    // draw the line graph and time selector
    lineGraph.draw({
      data : RedThread.utils.scoreStrategies(tweets)
    });
    timeSelector.draw({
      data : RedThread.utils.scoreStrategies(tweets)
    });
  });

});
