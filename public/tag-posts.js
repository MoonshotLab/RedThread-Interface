$(function(){
  var $tweets = $('#tweets');

  tweets.forEach(function(tweet){
    // ensure these properties exist
    if(!tweet.retweet) tweet.retweet = [];
    if(!tweet.reply) tweet.reply = [];
    if(!tweet.favorite) tweet.favorite = [];
    if(!tweet.pillar) tweet.pillar = [];
    if(!tweet.authority) tweet.authority = [];

    // is it a regular tweet or a retweet?
    if(tweet.original.in_reply_to_status_id) tweet.type = 'retweet';
    else tweet.type = 'tweet';

    $tweets.append(templates.tweet({
      tweet       : tweet,
      authorities : tags.authorities,
      pillars     : tags.pillars
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




var templates = {};

templates.tweet = _.template([
  '<li id="tweet-<%= tweet._id %>" class="list-group-item tweet <%= tweet.type %>">',
    '<div class="row">',
      '<div class="col-xs-5 tweet-details">',
        '<h4 class="tweet-text">',
          '<%= tweet.original.text %>',
        '</h4>',
        '<div class="stats row">',
          '<div class="col-xs-3">',
            '<span class="key glyphicon glyphicon-retweet"></span>',
            '<span class="val">',
              '<%= tweet.retweet.length %>',
            '</span>',
          '</div>',
          '<div class="col-xs-3">',
            '<span class="key glyphicon glyphicon-star"></span>',
            '<span class="val">',
              '<%= tweet.favorite.length %>',
            '</span>',
          '</div>',
          '<div class="col-xs-3">',
            '<span class="key glyphicon glyphicon-share-alt"></span>',
            '<span class="val">',
              '<%= tweet.reply.length %>',
            '</span>',
          '</div>',
        '</div>',
      '</div>',
      '<div class="col-xs-7 actions">',
        '<div class="row">',
          '<div class="col-xs-6 pillars">',
            '<% _.each(pillars, function(pillar){ %>',
              '<div class="checkbox">',
                '<label>',
                  '<% if(tweet.pillar.indexOf(pillar.name) != -1){ %>',
                    '<input checked data-id="<%= tweet._id %>" data-type="pillar" type="checkbox" value=<%= pillar.name %> />',
                  '<% } else{ %>',
                    '<input data-id="<%= tweet._id %>" data-type="pillar" type="checkbox" value=<%= pillar.name %> />',
                  '<% } %>',
                  '<%= pillar.human %>',
                '</label>',
              '</div>',
            '<% }); %>',
          '</div>',
          '<div class="col-xs-6 authorities">',
            '<% _.each(authorities, function(authority){ %>',
              '<div class="checkbox authority">',
                '<label>',
                  '<% if(tweet.authority.indexOf(authority.name) != -1){ %>',
                    '<input checked data-id="<%= tweet._id %>" data-type="authority" type="checkbox" value=<%= authority.name %> />',
                  '<% } else{ %>',
                    '<input data-id="<%= tweet._id %>" data-type="authority" type="checkbox" value=<%= authority.name %> />',
                  '<% } %>',
                  '<%= authority.human %>',
                '</label>',
              '</div>',
            '<% }); %>',
          '</div>',
        '</div>',
      '</div>',
    '</div>',
  '</li>'
].join(''));
