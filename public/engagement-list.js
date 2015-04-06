var getInputFromTag = function(tag){
  var $tweet = $('#tweet-' + tag.id);
  var selector = 'input[name="' + tag.type + '-' + tag.val + '"]';
  var $input = $tweet.find(selector);

  return $input;
};

socket.on('tag-tweet', function(tag){
  getInputFromTag(tag).prop('checked', true);
});


socket.on('untag-tweet', function(tag){
  getInputFromTag(tag).prop('checked', false);
});



$(function(){
  var $engagements = $('#engagements');

  RedThread.page.tweets.forEach(function(tweet){
    RedThread.utils.normalizeTweet(tweet);
    
    $engagements.append(RedThread.templates.engagement({
      tweet       : tweet,
      authorities : RedThread.utils.strategies.authority,
      pillars     : RedThread.utils.strategies.pillar,
      score       : RedThread.utils.scoreTweet(tweet)
    }));

    // add an event handler so the checkboxes work
    $('#tweet-' + tweet._id).find('input').change(function(e){
      var evt = 'untag-tweet';
      if($(this).prop('checked')) evt = 'tag-tweet';

      socket.emit(evt, {
        type  : $(this).data('type'),
        id    : $(this).data('id'),
        val   : $(this).val()
      });
    });
  });
});
