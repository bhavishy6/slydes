/*MONGODB vars:*/
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var Mongoose = require('./mongooses.js');

//TODO: check URL GEN... maybe better for smaller string
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var insertNewAlbum = function(ownerName, title, desc, key, callback) {
	var genURL = guidGenerator();
	Mongoose.Album.find({}, function(err, albums) {
		albums.forEach(function(album) {
			if (album.url === genURL) {
				//the genURL is not unique
				genURL = guidGenerator();
			} else {
				//the genURL is indeed unique
			}
		});
	});
	var AlbumGoose = new Mongoose.Album(
		{ owner:  ownerName,
		  title: title,
		  description: desc,
		  url: genURL,
		  key: key
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

var getAllImagesInAlbum = function(ownerName, album, callback) {
	Mongoose.Album.findOne( { owner: ownerName, title:album}, function(err, album) {
		var images = [];
		callback(album.images);
		return album.images;
	} );
}

var getAlbum = function(ownerName, album, callback) {
	Mongoose.Album.findOne( { owner: ownerName, title:album}, function(err, album) {
		var images = [];
		callback(album);
		return album;
	} );
}

var getAlbumByURL = function(url, callback) {
	Mongoose.Album.findOne( { url: url }, function(err, album) {
		callback(album);
		return album;
	} );
}

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
			insertImageToAlbum(filename, owner, album, key, function() {
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

	DB_insertNewAlbum : function (ownerName, title, desc, key) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			insertNewAlbum(ownerName, title, desc, key, function() {
			  db.close();
				console.log("db close");
			});
		});
	},

	DB_getAllUserAlbumsTitles : function(userName, callback) {
		return QUERY_getAllUserAlbums(userName).lean().exec(function(err, albums) {
			var ret = [];
			callback(albums);
			console.log("MOGNOJS: " + albums);
			return (albums);
		});
	},

	DB_getAllImagesInAlbum : function(ownerName, album, callback) {
		return getAllImagesInAlbum(ownerName, album, callback);
	},

	DB_getAlbumByName : function(ownerName, album, callback) {
		return getAlbum(ownerName, album, callback);
	},

	DB_getAlbumByURL : function(url, callback) {
		return getAlbumByURL(url, callback);
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
