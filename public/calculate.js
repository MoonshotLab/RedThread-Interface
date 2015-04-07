// pass all of these functions user objects to get a score back
RedThread.calculate = {

  score : function(type, user){
    return this[type + 'Score'](user);
  },

  influencerScore : function(user){
    var friendDiff = user.followers_count - user.friends_count;
    if(friendDiff < 1) friendDiff = 1;
    if(friendDiff > 50000) friendDiff = 50000;
    var score = friendDiff/100;
    return Math.round((score + 0.00001) * 100) / 100;
  },

  favoriteScore : function(user){
    return 0.25*this.influencerScore(user);
  },

  replyScore : function(user){
    return 0.75*this.influencerScore(user);
  },

  retweetScore : function(user){
    return 1*this.influencerScore(user);
  }
};
