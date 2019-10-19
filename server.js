const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userController = require('./controllers/user')
const passport = require('passport')
const authController = require('./controllers/auth')
const imageController = require('./controllers/image')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const Image = require('./models/image');
const multer = require('multer')
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
require('./controllers/auth');


var app = express();
// app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(cors({credentials: true, origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));


const router = express.Router()

router.get('/', (req, res) => {})

// connecting to mongodb database
const mongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/SGPhotos?retryWrites=true&w=majority';
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
    cloud_name: 'savanna-photos', 
    api_key: '153863721185536', 
    api_secret: 'hzbrXBu5uP0wPiN2GkG_KxZFE_8' 
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
    
                image.image_url = file.url
                image.album = req.params.album_id
                image.order = docCount
                image.userId = req.user
    
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


app.listen(3000);
