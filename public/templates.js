// some templates and stuff
RedThread.templates = {};


RedThread.templates.strategy = _.template([
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



RedThread.templates.action = _.template([
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



RedThread.templates.engagementGroup = _.template([
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



RedThread.templates.engagement = _.template([
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
