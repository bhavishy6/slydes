var express	=	require("express");
var bodyParser =	require("body-parser");
var fs = require("fs-extra");
var path = require("path");
var multer	=	require('multer');
var app	=	express();

//MongoClient:
var mogodb = require('./mongo.js');

var Mongoose = require('./mongooses.js');

//ENVIRONMENTS:
app.use(bodyParser.urlencoded({ extended:false }));
app.use('/styles', express.static(__dirname + '/styles'));
app.use('/js', express.static(__dirname + '/js'));

app.use(bodyParser.json());
app.use('/public', express.static(__dirname + "/public"));

//FINAL VARS:
var UPLOAD_LIMIT = 5;
var MUST_WALK_AGAIN = 1;

//global vars
var imagesUpload = [];

var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads/');
    },
    filename: function (req, file, callback) {
		var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});

		var filename = "";
        switch (file.mimetype){
            case "image/jpeg":
                filename= file.fieldname + '-' + guid  + ".jpg";
                console.log(filename + " is a [jpg]");
                break;
            case "image/png":
                filename= file.fieldname + '-' + guid + ".png";
                console.log(filename + "is a [png]");
                break;
            case "image/gif":
                filename= file.fieldname + '-' + guid + ".gif";
                console.log(filename + "is a [gif]");
                break;
            default:
                filename= file.fieldname + '-' + guid + ".jpg";
                console.log(filename + "defaulted to [jpg]");
                break;
        }
        console.log("filename :" + filename);
        createImageObject(filename);
		callback(null, filename);
    }
});

function createImageObject(filename) {
    imagesUpload.push(new Mongoose.Image( {	date: Date.now(), filename: filename, meta: { favs: 0 } } ));
}


var upload = multer({ storage : storage }).array('userPhoto', UPLOAD_LIMIT);

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/get_upload_limit", function(req, res) {
    res.json({upload_limit: UPLOAD_LIMIT});
});

var items = [];

app.post("/images", function(req, res) {
    mogodb.DB_getAlbumByName("emma watson", req.body.album_select, function(album) {
        console.log(JSON.stringify(album));
        res.redirect('/album/' + album.url);
    });
});

app.get('/album/:guid', function(req, res) {
    mogodb.DB_getAlbumByURL(req.params.guid, function(album) {

    });
});

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}


app.get("/get_albums_titles", function(req, res) {
	mogodb.DB_getAllUserAlbumsTitles("emma watson", function(albums) {
		var titles = [];
		albums.forEach(function(album) {
			titles.push(album.title);
		});
		res.json(titles);
	});
});

//TODO: DELETE ALBUM
app.post("/delete_album", function(req, res) {

});

app.post("/new_album", function(req, res) {
    //TODO: hashing/salting for the album key
	mogodb.DB_insertNewAlbum("emma watson", req.body.albumtitle, req.body.desc, req.body.key)
	res.end();
});

//TODO: EMPTY ALBUM
app.post("/empty_album", function(req, res) {
    fs.emptyDir()
});

app.post("/uploadToAlbum", upload, function(req,res){
//    upload(req,res,function(err) {
//        fs.mkdirSync("./public/uploads/");
		MUST_WALK_AGAIN = 1;
		mogodb.DB_insertMongooseImagesToAlbum(imagesUpload, "emma watson", req.body.album_selector, function(album) {
            console.log("insert callback:: \n" + album);
		});
        res.end("File is uploaded");
//    });
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});
