const multer = require('multer')
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const mongoose = require('mongoose')
const server = require('../server')
const passport = require('passport')
const Image = require('../models/image');

// cloudinary config settings
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

// exports.postImage = (upload.array('files'), async (req, res, next) => {
//     res.json(req.files)
//     passport.authenticate('jwt', async (err, user) => {
//         try {
//             server.db.collection('images').countDocuments({ userId: user, album: req.params.album_id })
//             .then(res => {
                
//                 let docCount = res
//                 req.files.forEach(file => {
//                     var image = new Image()
//                     docCount += 1

//                     image.image_url = file.url
//                     image.album = req.params.album_id
//                     image.order = docCount
//                     image.userId = user

//                     const path = file.path
//                     const uniqueFilename = new Date().toISOString()
                    
//                     cloudinary.uploader.upload(
//                     path,
//                     { public_id: `media/${uniqueFilename}`, tags: `media` }, // directory and tags are optional
//                     function(err, image) {
//                         if (err) return res.send(err)
//                         // console.log('file uploaded to Cloudinary')
//                         // remove file from server
//                         const fs = require('fs')
//                         fs.unlinkSync(path)
//                         // return image details
//                         res.json(image)
//                     }
//                     )
//                     // Uploading the image file to mongodb
//                     image.save(err => {
//                         if(err)
//                             res.send(err)
//                     })
//                 })
//             })
//         }
//       catch (error){
//         return next(error)
//       }
//     })(req, res, next)
//     return res.json(req.files);
// })




// GET request to retrieve the image file from mongodb, containing the album its from and the image url
exports.getImage = ((req, res) => {
    server.db.collection('images').find({userId: req.params.user, album: req.params.album_id}).sort({'order': +1}).toArray((err, files) => {
        // Check if files exist  
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'no files found'
            }); 
        }
        // Files exist

        return res.json(files);
    });
})

exports.getImageUrls = ((req, res) => {
    server.db.collection('images').find({userId: req.params.user, album: req.params.album_id}).sort({'order': +1}).toArray((err, files) => {
        // Check if files exist  
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'no files found'
            }); 
        }
        // Files exist
        let urlArray = []
        files.forEach(file => {
            urlArray.push(file.image_url)
        })
        return res.json(urlArray);
    });
})

// POST request to 'save' the album to mongodb
// Once user clicks the 'save album' button, the current album array will be uploaded to mongodb
// (the old list will be deleted immediately after with a delete request)
exports.saveImage = ((req, res) => {
    req.body.forEach(item => {
        item.userId = req.user
        server.db.collection('images').insertOne(
            item,
            (err, result) => {
            if(err) return console.log(err)
        })
    })
    return res.send('files saved')
})

// DELETE request to delete all items from an album
// this will be called when the client saves their album
// all files in that album will be deleted and then replaced with the new altered album
exports.deleteImage = ((req, res) => {
    server.db.collection('images').deleteMany({userId: req.user, album: req.params.album_id}, err => {
            if (err) console.log(err);
        })
    return res.json({message: 'file deleted'})
})
