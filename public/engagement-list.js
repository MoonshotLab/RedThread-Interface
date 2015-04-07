socket.on('tag-tweet', function(tag){
  $('#tweet-' + tag.id).find('.button.' + tag.val).toggleClass('down');
});


socket.on('untag-tweet', function(tag){
  $('#tweet-' + tag.id).find('.button.' + tag.val).toggleClass('down');
});



$(function(){
  var $engagements = $('#engagements');

  RedThread.page.tweets.forEach(function(tweet){
    RedThread.utils.normalizeTweet(tweet);

    var date = new Date(tweet.original.created_at);
    var formattedDate = [
      RedThread.utils.months[date.getMonth()],
      date.getDate()
    ].join(', ');

    $engagements.append(RedThread.templates.engagement({
      date            : formattedDate,
      tweet           : tweet,
      authorities     : RedThread.utils.strategies.authority,
      pillars         : RedThread.utils.strategies.pillar,
      score           : RedThread.utils.scoreTweet(tweet),
      topEngagements  : RedThread.utils.getTopEngagements(tweet, 3),
      colors          : RedThread.utils.colorScheme
    }));

    // add an event handler so the checkboxes work
    $('#tweet-' + tweet._id).find('.button').click(function(e){
      e.preventDefault();
      $(this).toggleClass('down');

      var evt = 'untag-tweet';
      if($(this).hasClass('down')) evt = 'tag-tweet';

      socket.emit(evt, {
        type  : $(this).data('type'),
        id    : $(this).data('id'),
        val   : $(this).data('value')
      });
    });
  });
});
