var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./lib/db');
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var server = http.Server(app);
server.listen(port, function(){
  console.log('server started, listening on port ' + port + '...');
});


app.get('/', function(req ,res){
  db.getMany('tweets').then(function(tweets){
    res.render('tag-posts', { tweets : tweets });
  });
});

app.get('/tag-posts', function(req ,res){
  res.render('tag-posts');
});

app.get('/view-data', function(req ,res){
  res.render('view-data');
});


var io = require('socket.io')(server);

io.on('connection', function(socket){

  socket.on('tag-tweet', function(tag){
    db.addTagToTweet(tag).then(function(){
      socket.broadcast.emit('tag-tweet', tag);
    });
  });

  socket.on('untag-tweet', function(tag){
    db.removeTagFromTweet(tag).then(function(){
      socket.broadcast.emit('untag-tweet', tag);
    });
  });
});
