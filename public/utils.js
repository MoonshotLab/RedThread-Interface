var utils = {};

// tweets can come from the server with missing data
// ensures all required properties exist and if not, gives
// them a default property if necessary
utils.normalizeTweet = function(tweet){
  if(!tweet.pillar)     tweet.pillar    = [];
  if(!tweet.authority)  tweet.authority = [];
  if(!tweet.retweet)    tweet.retweet   = [];
  if(!tweet.reply)      tweet.reply     = [];
  if(!tweet.favorite)   tweet.favorite  = [];

  if(!tweet.pillar.length)    tweet.pillar = ['none'];
  if(!tweet.authority.length) tweet.authority = ['none'];

  return tweet;
};


// define an rgb strategy based color scheme
utils.colorScheme = {
  'default'   : [0, 0, 0],
  'celebrate' : [76, 253, 89],
  'inspire'   : [191, 74, 251],
  'discover'  : [252, 71, 195],
  'create'    : [254, 240, 121],
  'crew'      : [114, 164, 252],
  'craft'     : [76, 253, 89],
  'style'     : [191, 74, 251],
  'music'     : [252, 71, 195],
  'play'      : [254, 240, 121],
  'none'      : [118, 250, 254],
};
