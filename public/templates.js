// some templates and stuff
RedThread.templates = {};
RedThread.templates.drawer = {};

RedThread.templates.drawer.strategy = _.template([
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


RedThread.templates.drawer.action = _.template([
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



RedThread.templates.drawer.engagementGroup = _.template([
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



RedThread.templates.drawer.engagement = _.template([
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



RedThread.templates.key = _.template([
  '<% keys.forEach(function(key){ %>',
    '<li>',
      '<span class="key" style=background-color:<%= key.color %>></span>',
      '<span class="value"><%= key.value %></span>',
    '</li>',
  '<% }) %>',
].join(''));



RedThread.templates.engagement = _.template([
  '<li id="tweet-<%= tweet._id %>" class="tweet">',

    '<div class="scores">',
      '<div class="score total"><%= Math.round(score.total) %></div>',
      '<div class="score retweet"><i class="fa fa-retweet"></i><%= Math.round(score.retweet) %></div>',
      '<div class="score favorite"><i class="fa fa-star"></i><%= Math.round(score.favorite) %></div>',
      '<div class="score reply"><i class="fa fa-reply"></i><%= Math.round(score.reply) %></div>',
    '</div>',

    '<div class="tweet-details">',
      '<h2 class="tweet-text"><%= tweet.original.text %></h2>',

      '<div class="twitter-stats container">',
        '<h4>Engagement Counts</h4>',
        '<div class="twitter-stat">',
          '<span class="key">Retweets</span>',
          '<span class="val">',
            '<%= tweet.retweet.length %>',
          '</span>',
        '</div>',
        '<div class="twitter-stat">',
          '<span class="key">Replies</span>',
          '<span class="val">',
            '<%= tweet.reply.length %>',
          '</span>',
        '</div>',
        '<div class="twitter-stat">',
          '<span class="key">Favorites</span>',
          '<span class="val">',
            '<%= tweet.favorite.length %>',
          '</span>',
        '</div>',
        '<div class="twitter-stat">',
          '<span class="key">Total</span>',
          '<span class="val">',
            '<%= tweet.favorite.length %>',
          '</span>',
        '</div>',
      '</div>',

      '<div class="container">',
        '<div class="strategy-list">',
          '<h4>Pillars</h4>',
          '<% _.each(pillars, function(pillar){ %>',
            '<div class="checkbox">',
              '<label>',
                '<% if(tweet.pillar.indexOf(pillar) != -1){ %>',
                  '<input checked name="pillar-<%=pillar %>" data-id="<%= tweet._id %>" data-type="pillar" type="checkbox" value=<%= pillar %> />',
                '<% } else{ %>',
                  '<input name="pillar-<%=pillar %>" data-id="<%= tweet._id %>" data-type="pillar" type="checkbox" value=<%= pillar %> />',
                '<% } %>',
                '<%= pillar %>',
              '</label>',
            '</div>',
          '<% }); %>',
        '</div>',

        '<div class="strategy-list">',
          '<h4>Authorities</h4>',
          '<% _.each(authorities, function(authority){ %>',
            '<div class="checkbox authority">',
              '<label>',
                '<% if(tweet.authority.indexOf(authority) != -1){ %>',
                  '<input checked name="authority-<%=authority %>" data-id="<%= tweet._id %>" data-type="authority" type="checkbox" value=<%= authority %> />',
                '<% } else{ %>',
                  '<input name="authority-<%=authority %>" data-id="<%= tweet._id %>" data-type="authority" type="checkbox" value=<%= authority %> />',
                '<% } %>',
                '<%= authority %>',
              '</label>',
            '</div>',
          '<% }); %>',
        '</div>',
      '</div>',
    '</div>',
  '</li>'
].join(''));
