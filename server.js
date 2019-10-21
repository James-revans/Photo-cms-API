require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userController = require('./controllers/user')
const passport = require('passport')
const authController = require('./controllers/auth')
const imageController = require('./controllers/image')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectID;

const Image = require('./models/image');
const multer = require('multer')
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
require('./controllers/auth');
 

var app = express();
// app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));


const router = express.Router()

// router.get('/', (req, res) => {})

// connecting to mongodb database
const mongoURI = process.env.MONGO_URI
mongoose.connect(mongoURI, { useNewUrlParser: true }, { useUnifiedTopology: true });
exports.db = mongoose.connection;
var db = mongoose.connection;


// Register all routes with a prefix /api
app.use('/api', router);   


// // Endpoint that handles uploading and viewing images
// router.route('/image/:album_id')
//     // .post(imageController.postImage)
router.get('/image/:album_id/:user', imageController.getImage);

router.get('/imageurl/:album_id/:user', imageController.getImageUrls);

// Endpoint that handles saving the new updated album to mongodb
router.route('/save/:album_id')
    .post(passport.authenticate('jwt', {session: false}), imageController.saveImage)
    .delete(passport.authenticate('jwt', {session: false}), imageController.deleteImage);

// Endpoint that handles registering new users to mongodb
router.post('/signup', passport.authenticate('signup', {session: false}), async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user    
    })
})

// Endpoint that handles checking if the user exists and handing that user the jwt for access to routes
router.post('/login', userController.loginUser)

// cloudinary config settings
cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// cloudinary storage engine
var storage = cloudinaryStorage({
    cloudinary,
    folder: 'media',
    allowedFormats: ['jpg', 'png'],
    filename: function(req, file, cb) {
        cb(null, file.originalname)
      }
})  

const upload = multer({ storage: storage });

router.post('/image/:album_id', passport.authenticate('jwt', { session : false }), upload.array('files'), (req, res, next) => {
    db.collection('images').countDocuments({ userId: req.user, album: req.params.album_id })
    .then(res => {            
        let docCount = res
        req.files.forEach(file => {
            var image = new Image()
            docCount += 1
            
            image.image_url = file.secure_url
            image.album = req.params.album_id
            image.order = docCount
            image.userId = req.user
            image.public_id = file.public_id

            const path = file.path
            const uniqueFilename = new Date().toISOString()
            cloudinary.uploader.upload(
            path,
            { public_id: `media/${uniqueFilename}`, tags: `media` }, // directory and tags are optional
            
            function(err, image) {
                if (err) return res.send(err)
                // console.log('file uploaded to Cloudinary')
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
                
                // return image details
                res.json(image)
            }
            )
            // Uploading the image file to mongodb
            image.save(err => {
                if(err)
                    res.send(err)
            })
        })
    })
return res.json(req.files)
})


// DELETE request to delete all items from an album on mongoDB and cloudinary
// this will be called when the client saves their album
// all files in that album will be deleted and then replaced with the new altered album
router.delete('/delete', passport.authenticate('jwt', { session : false }), (req, res) => {

    // check the two passed in arrays for differences. destroy all differing images from cloudinary
    console.log(req.body.photo)
    cloudinary.v2.uploader.destroy(req.body.photo.public_id, function(error,result) {
        console.log(result, error) 
    });

    db.collection('images').deleteOne({ _id : ObjectId(req.body.photo._id) }, err => {
        if (err) console.log(err);
    })

    return res.send(req.body.photo)
})

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});




