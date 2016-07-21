var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//Mongoose Schemas:
var albumSchema = new Schema({
  owner:  String,
  title: String,
  description:   String,
  url: String,
  key: String,
  isProtected: Boolean,
  images: [{ date: Date, filename: String, meta: {favs: Number} }],
  meta: {
    favs:  Number
  }
});


var imageSchema = new Schema({
	date: Date,
	filename: String,
	meta: {
		favs: Number
	}
});

var Image = mongoose.model('image', imageSchema);

var Album = mongoose.model('album', albumSchema);

exports.Image = Image;
exports.Album = Album;
