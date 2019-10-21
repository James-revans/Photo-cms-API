const multer = require('multer')
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const mongoose = require('mongoose')
const server = require('../server')
const passport = require('passport')
const Image = require('../models/image');


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

// // DELETE request to delete all items from an album on mongoDB and cloudinary
// // this will be called when the client saves their album
// // all files in that album will be deleted and then replaced with the new altered album
exports.deleteImage = ((req, res) => {
    server.db.collection('images').deleteMany({userId: req.user, album: req.params.album_id}, err => {
            if (err) console.log(err);
    })

    // check the two passed in arrays for differences. destroy all differing images from cloudinary
    // deleteArray = req.data.mongoPhotos.diff(req.data.photos)
    // let public_ids = []
    // deleteArray.forEach(image => {
    //     public_ids.push(image.public_id)
    // })
    // cloudinary.v2.api.delete_resources(public_ids, options, callback);

    return res.json({message: 'file deleted'})
})

