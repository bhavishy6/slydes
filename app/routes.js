var multer	=	require('multer');


module.exports = function(app) {

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


    //Application
    app.get('*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile('./views/index.html', { root: __dirname });
    });
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

    app.get('/album', function(req, res) {
        //mogodb.getAlbumByURL
    });

    // app.get('/set/:guid', routes.set);

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
    	res.end("Album Created");
    });

    //TODO: EMPTY ALBUM
    app.post("/empty_album", function(req, res) {
        fs.emptyDir()
    });

    app.post("/uploadToAlbum", upload, function(req,res){
       upload(req,res,function(err) {
    //        fs.mkdirSync("./public/uploads/");
    		MUST_WALK_AGAIN = 1;
    		mogodb.DB_insertMongooseImagesToAlbum(imagesUpload, "emma watson", req.body.album_selector, function(album) {
                console.log("insert callback:: \n" + album);
    		});
            res.end("File is uploaded");
       });
    });
}
