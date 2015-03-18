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
