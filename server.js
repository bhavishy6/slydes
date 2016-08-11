var express	=	require("express");
var bodyParser =	require("body-parser");
var fs = require("fs-extra");
var path = require("path");
var app	=	express();
var multer	=	require('multer');
var bcrypt = require('bcrypt');
const saltRounds = 10;

//MongoClient:
var mogodb = require('./mongo.js');

var Mongoose = require('./mongooses.js');


// var index = require('./routes/index');

//ENVIRONMENTS:
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended:false }));
app.use('/styles', express.static(__dirname + '/styles'));
app.use('/fonts', express.static(__dirname + '/fonts'));
// app.use('/app', express.static(__dirname + '/app'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/js/controllers', express.static(__dirname + '/js/controllers'));
app.use('/js/services', express.static(__dirname + '/js/services'));
app.use('/templates', express.static(__dirname + '/templates'));
app.use('/modules', express.static(__dirname + '/modules'));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + "/public"));
app.use('/public/libs', express.static(__dirname + "/public/libs"));

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
    console.log("image mongoose created");
    imagesUpload.push(new Mongoose.Image( {	date: Date.now(), filename: filename, meta: { favs: 0 } } ));
}


var upload = multer({ storage : storage }).array('userPhoto');



// app.use('/', index);

//API Requests
app.get("/get_upload_limit", function(req, res) {
    res.json({upload_limit: UPLOAD_LIMIT});
});

var items = [];

app.post("/images", function(req, res) {
    mogodb.DB_getAlbumByName("emma watson", req.body.album_select, function(album) {
        console.log(JSON.stringify(album));
        res.redirect('/set/' + album.url);
    });
});

app.get('/check_album_protect', function(req, res) {
    mogodb.DB_checkAlbumProtection(req.query.url, function(isProtected) {
            console.log("server check protected: " + isProtected);
            return isProtected;
    });
});


app.get('/album', function(req, res) {

    mogodb.DB_getAlbumByURL(req.query.url, function(album) {
        res.json(album);
    });
});

app.get("/get_albums", function(req, res) {
    console.log("get_albums");
    mogodb.DB_getAllUserAlbums("emma watson", function(albums) {
        albums.forEach(function(album) {
            console.log(album);
        });
        res.json(albums);
    });
});

//TODO: DELETE ALBUM
app.post("/delete_album", function(req, res) {

});

app.post("/new_album", function(req, res) {
    //TODO: hashing/salting for the album key
    var hashed_key;
    var isProtected;
    if(req.body.key) {
        isProtected = true;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.key, salt, function(err, hash) {
                hashed_key = hash;
            });
        });
    } else {
        isProtected = false;
    }
    mogodb.DB_insertNewAlbum("emma watson", req.body.albumtitle, req.body.desc, hashed_key, isProtected);
    res.end("Album Created");
});

//TODO: EMPTY ALBUM
app.post("/empty_album", function(req, res) {
    fs.emptyDir()
});

app.post("/uploadToAlbum", upload, function(req,res){
        MUST_WALK_AGAIN = 1;
        mogodb.DB_insertMongooseImagesToAlbum(imagesUpload, req.body.album_selector, function(album) {
            console.log("insert callback:: \n" + album);
        });
        res.end("File is uploaded");
   // });
});

app.post("/createAlbum", function(req, res) {
    upload(req, res, function(err) {
        var album_title = req.body.albumtitle;
        var album_description = req.body.desc;

        var hashed_key;
        var isProtected;
        if(req.body.key) {
            isProtected = true;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.key, salt, function(err, hash) {
                    hashed_key = hash;
                });
            });
        } else {
            isProtected = false;
        }

        MUST_WALK_AGAIN = 1;
        mogodb.DB_createAlbum("emma watson", album_title, album_description, hashed_key, isProtected, imagesUpload, function(albumURL) {
            console.log("Created Album \n" + albumURL);
            // res.json({feedback: "Album Created!", url: url});
            var redirectString = '#/set/'+albumURL;
            res.json({status: "success", url: redirectString});
        });
    });
})

app.get("request_access", function(req, res) {

});

//Application
app.get('*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('./views/index.html', { root: __dirname });
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});
