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
    '<h3 class="date"><%= date %></h3>',
    '<h2 class="tweet-text"><%= tweet.original.text %></h2>',
    '<div class="strategy-list pillars">',
      '<% _.each(pillars, function(pillar){ %>',
        '<% var klass="up" %>',
        '<% if(tweet.pillar.indexOf(pillar) != -1) klass="down" %>',
        '<a class="button <%= klass %> <%= pillar %>" href="#" data-id="<%= tweet._id %>" data-value="<%= pillar %>">',
          '<div class="text"><%= pillar %></div>',
        '</a>',
      '<% }); %>',
    '</div>',

    '<div class="strategy-list authorities">',
      '<% _.each(authorities, function(authority){ %>',
        '<% var klass="up" %>',
        '<% if(tweet.authority.indexOf(authority) != -1) klass="down" %>',
        '<a class="button <%= klass %> <%= authority %>" href="#" data-id="<%= tweet._id %>" data-value="<%= authority %>">',
          '<div class="text"><%= authority %></div>',
        '</a>',
      '<% }); %>',
    '</div>',

    '<div class="scores">',
      '<div class="score retweet"><i class="fa fa-retweet"></i><%= Math.round(tweet.retweet.length*1000)/1000 %></div>',
      '<div class="score favorite"><i class="fa fa-star"></i><%= Math.round(tweet.favorite.length*1000)/1000 %></div>',
      '<div class="score reply"><i class="fa fa-reply"></i><%= Math.round(tweet.reply.length*1000)/1000 %></div>',
      '<div class="score total"><%= Math.round(score.total*10)/10 %></div>',
    '</div>',

    '<% if(topEngagements.length){ %>',
      '<div class="top-engagements">',
        '<h4>Top Engagements: </h4>',
        '<ul>',
          '<% _.each(topEngagements, function(topEngagement){ %>',
            '<li>',
              '<span class="score"><%= Math.round(topEngagement.score*100)/100 %></span>',
              '<% if(topEngagement.type == "reply") {%>',
                '<p>Reply: <%= topEngagement.text %></p>',
              '<% } else { %>',
                '<p><%= topEngagement.type %></p>',
              '<% } %>',
            '</li>',
          '<% }); %>',
        '</ul>',
      '</div>',
    '<% } %>',
  '</li>'
].join(''));
