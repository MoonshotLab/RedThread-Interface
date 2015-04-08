var queryParams = {};

location.search.replace('?', '').split('&').forEach(function(query){
  var split = query.split('=');
  queryParams[split[0]] = split[1];
});


socket.on('tag-tweet', function(tag){
  $('#tweet-' + tag.id).find('.button.' + tag.val).toggleClass('down');
});


socket.on('untag-tweet', function(tag){
  $('#tweet-' + tag.id).find('.button.' + tag.val).toggleClass('down');
});


socket.on('tweet-deleted', function(tag){
  $('#tweet-' + tag.id).remove();
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

    var isAdmin = false;
    if(queryParams.admin) isAdmin = true;

    $engagements.append(RedThread.templates.engagement({
      date            : formattedDate,
      isAdmin         : isAdmin,
      tweet           : tweet,
      authorities     : RedThread.utils.strategies.authority,
      pillars         : RedThread.utils.strategies.pillar,
      score           : RedThread.utils.scoreTweet(tweet),
      topEngagements  : RedThread.utils.getTopEngagements(tweet, 3),
      colors          : RedThread.utils.colorScheme
    }));

    $('#tweet-' + tweet._id).find('.delete').click(function(e){
      var confirmation = confirm('Are you sure you want to delete this? It\'ll be gone FOREVER. Like forever forever. This is unrecoverable. SRSLY.');
      if(confirmation){
        socket.emit('delete-tweet', {
          id : $(this).data('id')
        });
      }
    });

    // allow content to be tagged
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
