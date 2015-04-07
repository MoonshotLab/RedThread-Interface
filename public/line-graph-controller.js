$(function(){
  // what strategy and view model are we going to start working with?
  var strategy  = $('input[name=strategy-type]:checked').val();
  var viewModel = $('input[name=model-by]:checked').val();


  // make the key and default it to the selected strategy
  RedThread.utils.makeKey(strategy);


  // start the controls, listen for change
  RedThread.controls.init({
    strategyChange : function(strategy){
      RedThread.utils.makeKey(strategy);
      $('#graphic').html('');
      $('#time-selector').html('');

      lineGraph.draw({
        data : RedThread.utils.scoreStrategies(tweets, strategy)
      });

      timeSelector.draw({
        data : RedThread.utils.scoreStrategies(tweets, strategy)
      });
    }
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

    // draw the line graph
    lineGraph.draw({
      data : RedThread.utils.scoreStrategies(tweets, strategy)
    });

    // draw the time selector
    timeSelector.draw({
      data : RedThread.utils.scoreStrategies(tweets, strategy)
    });
  });

});
