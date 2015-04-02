var Q = require('q');
var config = require('../config')();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var collections = {};



MongoClient.connect(config.DB_CONNECT, function(err, db){
  client = db;
  if(err) console.log('error connecting to db...', err);
  else console.log('connected to database');

  collections.twitterFollows = db.collection('twitterFollows');
  collections.twitterMentions = db.collection('twitterMentions');
  collections.twitterReference = db.collection('twitterReference');
  collections.tweets = db.collection('tweets');
});



// type:    any collection type (tweets, twitterFollows, etc.)
// limit:   the max number to return
// offset:  the offset number to start from
exports.getMany = function(type, limit, offset){
  var deferred = Q.defer();

  if(!limit) limit = 100;

  collections[type]
    .find()
    .sort([['_id', 1]])
    .skip(offset)
    .limit(limit)
    .toArray(
      function(err, results){
        if(err) deferred.reject(results);
        else deferred.resolve(results.reverse());
      }
    );

  return deferred.promise;
};



// ALL REQUIRED
// id:      the mongoId of the record to be updated
// type:    the type of tag to add (pillar or authority)
// val:     the tag to add to the type (celebrate, inspire, etc.)
exports.addTagToTweet = function(opts){
  var deferred = Q.defer();
  var insert = {};
  insert[opts.type] = opts.val;

  collections.tweets.update(
    { _id   : new ObjectId(opts.id) },
    { $push : insert                },
    function(err, res){
      if(err) deferred.reject(err);
      else {
        deferred.resolve({
          type  : opts.type,
          val   : opts.val
        });
      }
    }
  );

  return deferred.promise;
};



// ALL REQUIRED
// id:      the mongoId of the record to be updated
// type:    the type of tag to add (pillar or authority)
// val:     the tag to add to the type (celebrate, inspire, etc.)
exports.removeTagFromTweet = function(opts){
  var deferred = Q.defer();

  var remove = {};
  remove[opts.type] = opts.val;

  collections.tweets.update(
    { _id   : new ObjectId(opts.id) },
    { $pull : remove                },
    function(err, res){
      if(err) deferred.reject(err);
      else {
        deferred.resolve({
          type  : opts.type,
          val   : opts.val
        });
      }
    }
  );

  return deferred.promise;
};
