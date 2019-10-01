// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const crypto = require('crypto');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(methodOverride('_method'));

// // Connecting to MongoDB databases
// const portraitsmongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/portraits?retryWrites=true&w=majority';
// const familymongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/family?retryWrites=true&w=majority';
// const eventsmongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/events?retryWrites=true&w=majority';
// const miscmongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/misc?retryWrites=true&w=majority';
// const recentmongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/recent?retryWrites=true&w=majority';

// const portraitConn = mongoose.createConnection(portraitsmongoURI, { useNewUrlParser: true });
// const familyConn = mongoose.createConnection(familymongoURI, { useNewUrlParser: true });
// const eventsConn = mongoose.createConnection(eventsmongoURI, { useNewUrlParser: true });
// const miscConn = mongoose.createConnection(miscmongoURI, { useNewUrlParser: true });
// const recentConn = mongoose.createConnection(recentmongoURI, { useNewUrlParser: true });

// // // Init gfs
// let Pgfs, Fgfs, Egfs, Mgfs, Rgfs;

// portraitConn.once('open', function () {
//     Pgfs = Grid(portraitConn.db, mongoose.mongo);
//     Pgfs.collection('uploads');
//   })

//   familyConn.once('open', function () {
//     Fgfs = Grid(familyConn.db, mongoose.mongo);
//     Fgfs.collection('uploads');
//   })

//   eventsConn.once('open', function () {
//     Egfs = Grid(eventsConn.db, mongoose.mongo);
//     Egfs.collection('uploads');
//   })

//   miscConn.once('open', function () {
//     Mgfs = Grid(miscConn.db, mongoose.mongo);
//     Mgfs.collection('uploads');
//   })

//   recentConn.once('open', function () {
//     Rgfs = Grid(recentConn.db, mongoose.mongo);
//     Rgfs.collection('uploads');
//   })

// // // Create storage engine for portraits
// const storage = new GridFsStorage({
//     url: portraitsmongoURI,
//     bucketName: 'portraits'
//  });
// const pUpload = multer({ storage });

// const fStorage = new GridFsStorage({
//     url: familymongoURI,
//     bucketName: 'family'
//  });
// const fUpload = multer({ storage: fStorage });

// const eStorage = new GridFsStorage({
//     url: eventsmongoURI,
//     bucketName: 'events'
//  });
// const eUpload = multer({ storage: eStorage });

// const mStorage = new GridFsStorage({
//     url: miscmongoURI,
//     bucketName: 'misc'
//  });
// const mUpload = multer({ storage: mStorage });

// const rStorage = new GridFsStorage({
//     url: recentmongoURI,
//     bucketName: 'recent'
//  });
// const rUpload = multer({ storage: rStorage });

// // POST request will upload file to MongoDB
// app.post('/uploadportraits', pUpload.array('files'), (req, res) => {
//     res.send(req.files);
// });

// // POST images to family
// app.post('/uploadfamily', fUpload.array('files'), (req, res) => {
//     res.send(req.files);
// });

// // POST images to events
// app.post('/uploadevents', eUpload.array('files'), (req, res) => {
//     res.send(req.files);
// });

// // POST images to misc
// app.post('/uploadmisc', mUpload.array('files'), (req, res) => {
//     res.send(req.files);
// });

// // POST images to recent
// app.post('/uploadrecent', rUpload.array('files'), (req, res) => {
//     res.send(req.files);
// });



// // GET request to see all files that have been uploaded to MongoDB
// app.get('/files', (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         //Check if files exist
//         if(!files || files.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist'
//             });
//         }

//         // Files exist
//         return res.json(files);
//     });
// });

// // GET request to see all files of a certain type
// app.get('/files/:filetype', (req, res) => {
//     gfs.files.find({filetype: req.params.filetype}, (err, file) => {
//         // Checking if file exists
//         if(!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No such file exists'
//             });
//         }
//     });
// });

// // GET request to see all files of a certain type and display them
// app.get('/image/:filename', (req, res) => {
//     gfs.files.findOne({filename: req.params.filename}, (err, file) => {
//         // Checking if file exists
//         if(!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No such file exists'
//             });
//         }

//         if(file.contentType === 'image/jpdeg' || file.contentType === 'imamge/png') {
//             // Read output to browser
//             const readstream = gfs.createReadStream(file.filename);
//             readstream.pipe(res);
//         }
//         else {
//             res.status(404).json({
//                 err: 'not an image'
//             });
//         }
//     });
// });


// const port = 3000;

// app.listen(port, () => console.log(`app has started on port ${port}`));