const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();

app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Connecting to MongoDB database
const mongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/SGPhotos?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true }, { useUnifiedTopology: true });

let gfs;

conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
})

// Create storage engine for each category of images
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
          bucketName: 'media',
          metadata: req.params.id
        };
    }
 });

 var upload = multer({storage: storage})

// Uploading multiple images
app.post('/uploadimage/:id', upload.array('files'), (req, res) => {
    req.files.forEach(file => {
        file.metadata = req.params.id
    })
    res.send(req.files);
})

// Get all images referring to the portraits metadata id
app.get('/images/:album_id', (req, res) => {
    gfs.collection('media');
    gfs.files.find({metadata: req.params.album_id}).toArray((err, files) => {
        //Check if files exist  
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: req.params.album_id
            }); 
        }
        // Files exist
        return res.json(files);
    });
});

// DELETE request to find all files of a certain type and delete them all
// app.delete('/delete/:collection', (req, res) => {
//     gfs.collection(req.params.collection);
//     gfs.files.find.delete((err, files) => {
//         //Check if files exist  
//         if(!files || files.length === 0) {
//             return res.status(404).json({
//                 err: req.params.collection
//             }); 
//         }
//         // Files exist
//         return res.json(files);
//     })
// })

// DELETE request to find one file and delete
app.delete('/delete/:filename', (req, res) => {
    gfs.collection('media').remove({filename: req.params.filename}, function (err) {
        if (err) console.log(err);
        console.log('success'); 

        return res.json({message: 'file deleted'})
      });
})

app.listen(3000, () => console.log('App has started on port 3000'));






