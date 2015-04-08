// some templates and stuff
RedThread.templates = {};
RedThread.templates.drawer = {};

RedThread.templates.drawer.strategy = _.template([
  '<section class="strategy">',
    '<div style="background-color:<%= color %>" class="flag"></div>',
    '<div class="content">',
      '<div class="score">',
        '<span class="percent"><%= percent %>%</span>',
        '<span class="points"><%= Math.round(score*100)/100 %><i class="fa fa-bolt"></i></span>',
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
        '<span class="points"><%= Math.round(score*100)/100 %><i class="fa fa-bolt"></i></span>',
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
        '<span class="points"><%= Math.round(score * 100) / 100 %><i class="fa fa-bolt"></i></span>',
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
        '<span class="points"><%= Math.round(score * 100) / 100 %><i class="fa fa-bolt"></i></span>',
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
  '<h2>Flavor Index: <%= Math.round(score) %><i class="fa fa-bolt"></i></h2>',
  '<ul>',
    '<% for(var key in strategies){ %>',
      '<li>',
        '<span class="bar" style=background-color:<%= strategies[key].color %>></span>',
        '<span class="key"><%= key %></span>',
        '<span class="value"><%= Math.round(strategies[key].score) %><i class="fa fa-bolt"></i></span>',
      '</li>',
    '<% } %>',
  '</ul>'
].join(''));



RedThread.templates.engagement = _.template([
  '<li id="tweet-<%= tweet._id %>" class="tweet">',
    '<h3 class="date"><%= date %></h3>',
    '<h2 class="tweet-text"><%= tweet.original.text %></h2>',

    '<div class="scores">',
      '<div class="score retweet"><i class="fa fa-retweet"></i><%= Math.round(tweet.retweet.length*1000)/1000 %></div>',
      '<div class="score favorite"><i class="fa fa-star"></i><%= Math.round(tweet.favorite.length*1000)/1000 %></div>',
      '<div class="score reply"><i class="fa fa-reply"></i><%= Math.round(tweet.reply.length*1000)/1000 %></div>',
      '<div class="score total"><%= Math.round(score.total*10)/10 %><i class="fa fa-bolt"></i></div>',
    '</div>',

    '<% if(topEngagements.length){ %>',
      '<div class="top-engagements">',
        '<ul>',
          '<% _.each(topEngagements, function(topEngagement){ %>',
            '<li>',
              '<span class="score"><%= Math.round(topEngagement.score*100)/100 %><i class="fa fa-bolt"></i></span>',
              '<% if(topEngagement.type == "favorite"){ %>',
                '<i class="fa fa-star"></i>',
              '<% } else { %>',
                '<i class="fa fa-<%= topEngagement.type %>"></i>',
              '<% } %> ',
              '<a class="user-name" target="_blank" title="<%= topEngagement.text %>" href="http://twitter.com/<%= topEngagement.user.screen_name %>">',
                '<%= topEngagement.user.screen_name %>',
              '</a>',
            '</li>',
          '<% }); %>',
        '</ul>',
      '</div>',
    '<% } %>',

    '<div class="strategy-list pillars">',
      '<% _.each(pillars, function(pillar){ %>',
        '<% var klass="" %>',
        '<% if(tweet.pillar.indexOf(pillar) != -1) klass="down" %>',
        '<a class="button <%= klass %> <%= pillar %>" href="#" data-type="pillar" data-id="<%= tweet._id %>" data-value="<%= pillar %>">',
          '<%= pillar %>',
        '</a>',
      '<% }); %>',
    '</div>',

    '<div class="strategy-list authorities">',
      '<% _.each(authorities, function(authority){ %>',
        '<% var klass="" %>',
        '<% if(tweet.authority.indexOf(authority) != -1) klass="down" %>',
        '<a class="button <%= klass %> <%= authority %>" href="#" data-type="authority" data-id="<%= tweet._id %>" data-value="<%= authority %>">',
          '<%= authority %>',
        '</a>',
      '<% }); %>',
    '</div>',
  '</li>'
].join(''));
