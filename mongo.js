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

var insertNewAlbum = function(ownerName, title, desc, key, isProtected, callback) {
	var genURL = guidGenerator();
    var savedAlbum;
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
    if(key) {
    	var AlbumGoose = new Mongoose.Album(
    		{ owner:  ownerName,
    		  title: title,
    		  description: desc,
    		  url: genURL,
    		  key: key,
              isProtected: isProtected
    		} );
    } else {
        var AlbumGoose = new Mongoose.Album(
    		{ owner:  ownerName,
    		  title: title,
    		  description: desc,
    		  url: genURL,
              isProtected: isProtected
    		} );
    }
	AlbumGoose.save(function(err, album) {
		if (err) return console.error(err);
        savedAlbum = album;
        callback(album.url);
	});
    console.log(album + "album saved");
    console.log("callback guid: " + genURL);

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
        console.log("URL: " + url + "\n\n" + album);
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

var checkAlbumProtection = function(guid, callback) {
    Mongoose.Album.findOne( {url:guid}, function(err, album) {
		if(err) return console.error(err);
        if(album.key) {
            console.log("album '"+guid+"' is protected");
            return true;
        } else {
            return false;
        }
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

var insertMongooseImagesToAlbum = function(images, guid, callback) {
	var albumUpdated;
	Mongoose.Album.findOne( { url:guid }, function (err, album) {
        console.log("Album to be uploaded tooooooo: " + album);
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
	});
	images.forEach(function(image) {
		image.save(function(err, image) {
			if (err) return console.error(err);
			console.log(image.filename + " pushed succesfully");
		});
	});
	callback(albumUpdated);
}

var createAlbum = function(ownerName, title, desc, key, isProtected, monImages, callback) {
    var genURL = guidGenerator();
    var savedAlbum;
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
    if(key) {
    	var AlbumGoose = new Mongoose.Album(
    		{ owner:  ownerName,
    		  title: title,
    		  description: desc,
    		  url: genURL,
              images: monImages,
    		  key: key,
              isProtected: isProtected
    		} );
    } else {
        var AlbumGoose = new Mongoose.Album(
    		{ owner:  ownerName,
    		  title: title,
    		  description: desc,
    		  url: genURL,
              images: monImages,
              isProtected: isProtected
    		} );
    }
	AlbumGoose.save(function(err, album) {
		if (err) return console.error(err);
        savedAlbum = album;
        callback(album.url);
	});

}

function QUERY_getAllUserAlbums(user) {
	return Mongoose.Album.find( {owner: user} );
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

	DB_insertMongooseImagesToAlbum : function (image, guid) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			insertMongooseImagesToAlbum(image, guid, function() {
			  db.close();
				console.log("db close");
			});
		});
	},

	DB_insertNewAlbum : function (ownerName, title, desc, key, isProtected) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			insertNewAlbum(ownerName, title, desc, key, isProtected, function() {
                db.close();
				console.log("db close");
			});
		});
	},

    DB_createAlbum : function(ownerName, title, desc, key, isProtected, images, callback) {
        MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			createAlbum(ownerName, title, desc, key, isProtected, images, function(url) {
                db.close();
				console.log("db close");
                callback(url);
			});
		});
    },

	DB_getAllUserAlbums : function(userName, callback) {
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
	},
    DB_checkAlbumProtection : function(url, callback) {
        return checkAlbumProtection(url, callback);
    }
}
