/*MONGODB vars:*/
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var Mongoose = require('./mongooses.js');


var insertNewAlbum = function(ownerName, title, desc, callback) {
	var AlbumGoose = new Mongoose.Album(
		{ owner:  ownerName,
		  title: title,
		  description: desc,
		} );

	AlbumGoose.save(function(err, album) {
		if (err) return console.error(err);
		console.log(album + "album saved");
	});

	/*db.collection('albums').insertOne( {
		"owner" : ownerName,
		"title" : title,
		"description" : desc,
		"images" : [{  }]
	}, function(err, result) {
		assert.equal(err, null);
		console.log("New album inserted:\n owner: "+ownerName+";\n title: " + title +";\n descrption: "+desc);
		callback();
	});*/
};

var getAllUserAlbums = function(userName, callback) {
	Mongoose.Album.find( {owner:userName}, function(err, albums) {
		if(err) return console.error(err);
		var albumTits = [];
		for(i=0;i<albums.length;i++) {
			console.log(albums[i]);
			albumTits.push(albums[i].title);
		}
		return albumTits;
	});
}

var insertImageToAlbum = function(filename, owner, album, callback) {
	var imageGoose = new Mongoose.Image( {	date: Date.now(),
											filename: filename,
											meta: {
												favs: 0
											}
										 } );

	Mongoose.Album.findOne( { owner:owner, title:album }, function (err, album) {
		if (err)
			return console.error(err);
		console.log("FOUND ALBUM: " + album);
		album.images.push(imageGoose);
		album.save(function (err) {
			if(err) {
				console.error(err);
			}
		})
		console.log(album);
	});


	imageGoose.save(function(err, image) {
		if (err) return console.error(err);

	});
	console.log("images pushed succesfully");

}

var insertMongooseImagesToAlbum = function(images, owner, album, callback) {
	var albumUpdated;
	Mongoose.Album.findOne( { owner:owner, title:album }, function (err, album) {
		if (err)
			return console.error(image.filename + "had ERROR:  "+err);
		console.log("FOUND ALBUM: " + album);
		images.forEach(function(image) {
			album.images.push(image);
		});
		album.save(function (err) {
			if(err) {
				console.error(err);
			}
		});
		albumUpdated = album;
		// console.log(album);
	});
	images.forEach(function(image) {
		image.save(function(err, image) {
			if (err) return console.error(err);
			console.log(image.filename + " pushed succesfully");
		});
	});
	callback(albumUpdated);
}

function QUERY_getAllUserAlbums(user) {
	return Mongoose.Album.find( {owner: user}, 'title');
}

module.exports = {
	DB_insertImageToAlbum : function (filename, owner, album) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			insertImageToAlbum(filename, owner, album, function() {
			  db.close();
				console.log("db close");
			});
		});
	},

	DB_insertMongooseImagesToAlbum : function (image, owner, album) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			insertMongooseImagesToAlbum(image, owner, album, function() {
			  db.close();
				console.log("db close");
			});
		});
	},

	DB_insertNewAlbum : function (ownerName, title, desc) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			insertNewAlbum(ownerName, title, desc, function() {
			  db.close();
				console.log("db close");
			});
		});
	},

	DB_getAllUserAlbumsTitles : function(userName, callback) {
		/*return Mongoose.Album.find( {owner: userName}, 'title', function (err, albums) {
			callback(albums);
		});*/

		return QUERY_getAllUserAlbums(userName).lean().exec(function(err, albums) {
			var ret = [];
			callback(albums);
			console.log("MOGNOJS: " + albums);
			return (albums);
		});


//		return ret;


		/*var query = Mongoose.Album.find({owner:userName});
		query.select('title');

		console.log("QUERY: " + query);

		query.then(function(albums){
		   albums.forEach(function(album){
			  console.log(album.title);
		   });
		}).error(function(error) {
			console.error(error);
		});*/

	}
}

/*var removeRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').deleteMany(
	   { "borough": "Manhattan" },
	   function(err, results) {
		   console.log(results);
		   callback();
      }
   );
};*/

/*modules.exports = {
	insertNewAlbum : function(ownerName, title, desc) {
		insertNewAlbum("albums", ownerName, title, desc);
	},
	getAllUserAlbums : function (username) {
		getAllUserAlbums("albums", title)
	}

}*/
