$(function(){

  // fetch the remote tweet data and create the sunburst as well as the
  $.ajax({
    url : '/tweets'
  }).done(function(tweets){

    // tweets can comeback from the server a little bit incomplete
    tweets.forEach(RedThread.utils.normalizeTweet);

    var lineGraph = new RedThread.LineGraph({
      selector  : '#graphic',
      width     : $('body').width(),
      height    : $('body').height() - $('#nav').height(),
      onChange  : function(data){
        console.log(data);
      }
    });

    // draw the line graph and time selector
    lineGraph.draw({
      data : RedThread.utils.scoreStrategies(tweets)
    });
  });
});
