// const express = require('express')
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
// const multer = require('multer')
// const cloudinary = require('cloudinary');
// const cloudinaryStorage = require('multer-storage-cloudinary');
// var userController = require('./controllers/user')
// const passport = require('passport')
// const authController = require('./controllers/auth')

// var app = express();
// app.use(bodyParser.json());
// app.use(require('cors')());
// app.use(passport.initialize())

// // connecting to mongodb database
// const mongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/SGPhotos?retryWrites=true&w=majority';
// mongoose.connect(mongoURI, { useNewUrlParser: true }, { useUnifiedTopology: true });
// var db = mongoose.connection;

// // cloudinary config settings
// cloudinary.config({
//     cloud_name: 'savanna-photos', 
//     api_key: '153863721185536', 
//     api_secret: 'hzbrXBu5uP0wPiN2GkG_KxZFE_8' 
// })

// // cloudinary storage engine
// var storage = cloudinaryStorage({
//     cloudinary,
//     folder: 'media',
//     allowedFormats: ['jpg', 'png'],
//     filename: function(req, file, cb) {
//         cb(null, file.originalname)
//       }
// })

// const upload = multer({ storage: storage });

// // POST request to post the uploaded image to be hosted on cloudinary as well as uploading the image url to mongodb
// app.post('/uploadimage/:album_id', upload.array('files'), (req, res) => {
//     db.collection('media').countDocuments({ album: req.params.album_id })
//     .then(res => {
//         let docCount = res
//         req.files.forEach(file => {

//             file.album = req.params.album_id
//             const path = file.path
//             const uniqueFilename = new Date().toISOString()
//             docCount += 1
            
//             cloudinary.uploader.upload(
//             path,
//             { public_id: `media/${uniqueFilename}`, tags: `media` }, // directory and tags are optional
//             function(err, image) {
//                 if (err) return res.send(err)
//                 // console.log('file uploaded to Cloudinary')
//                 // remove file from server
//                 const fs = require('fs')
//                 fs.unlinkSync(path)
//                 // return image details
//                 res.json(image)
//             }
//             )
//             // Uploading the image url and the album it belongs to, to mongodb
//             db.collection('media').insertOne(
//                 {image_url: file.url, album: file.album, order: docCount}, (err, result) => {
//                 if(err) return console.log(err)
        
//                 console.log('saved to database')
//             })
//         })
//     }) 
//     res.json(req.files)
// });

// // POST request to 'save' the album to mongodb
// // Once user clicks the 'save album' button, the current album array will be uploaded to mongodb
// // (the old list will be deleted immediately after with a delete request)
// app.post('/savealbum', (req, res) => {
//     req.body.forEach(item => {
//         db.collection('media').insertOne(
//             item, (err, result) => {
//             if(err) return console.log(err)
//         })
//     })
// })

// // GET request to retrieve the image file from mongodb, containing the album its from and the image url
// app.get('/images/:album_id', (req, res) => {
//     db.collection('media').find({album: req.params.album_id}).sort({'order': +1}).toArray((err, files) => {
//         //Check if files exist  
//         if(!files || files.length === 0) {
//             return res.status(404).json({
//                 err: 'no files found'
//             }); 
//         }
//         // Files exist
//         return res.json(files);
//     });
// })

// // DELETE request to delete all items from an album
// // this will be called when the client saves their album
// // all files in that album will be deleted and then replaced with the new altered album
// app.delete('/delete/:album_id', (req, res) => {
//         db.collection('media').deleteMany({album: req.params.album_id}, err => {
//             if (err) console.log(err);
//             console.log('success'); 
    
//         })
    
//     return res.json({message: 'file deleted'})

// })

// // router.route('/users')
// //     .post(userController.postUsers)
// //     .get(userController.getUsers)



// app.listen(3000, () => console.log('App has started on port 3000'));
