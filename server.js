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
// const mongoURI = 'mongodb+srv://James-Evans:12345@cluster0-tgpqk.mongodb.net/photos?retryWrites=true&w=majority';
// const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true }, { useUnifiedTopology: true });

// let gfs, fgfs, egfs, mgfs, rgfs;

// conn.once('open', function () {
//     gfs = Grid(conn.db, mongoose.mongo);
//     // pgfs.collection('portraits');
//     // pgfs.collection('portraits');
//     // fgfs.collection('family');
//     // egfs.collection('events');
//     // mgfs.collection('misc');
//     // rgfs.collection('recent');

// })


// // Create storage engine for each category of images
// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return {
//           bucketName: 'portraits'
//         };
//     }
//  });
// const pUpload = multer({ storage });

// const fStorage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return {
//           bucketName: 'family'
//         };
//     }
//  });
// const fUpload = multer({ storage: fStorage });

// const eStorage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return {
//           bucketName: 'events'
//         };
//     }
//  });
// const eUpload = multer({ storage: eStorage });

// const mStorage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return {
//           bucketName: 'misc'
//         };
//     }
//  });
// const mUpload = multer({ storage: mStorage });

// const rStorage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return {
//           bucketName: 'recent'
//         };
//     }
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

// // GET request to see all photos of a specified collection that have been uploaded to MongoDB
// app.get('/photos/:collection', (req, res) => {  
//     gfs.collection(req.params.collection);
//     gfs.files.find().toArray((err, files) => {
//         //Check if files exist  
//         if(!files || files.length === 0) {
//             return res.status(404).json({
//                 err: req.params.collection
//             }); 
//         }
//         // Files exist
//         return res.json(files);
//     });
// });

// // GET request to see all files of a certain type and display them
// app.get('/photos/:collection/:filename', (req, res) => {
//     gfs.collection(req.params.collection);
//     gfs.files.findOne({filename: req.params.filename}, (err, file) => {
//         // Checking if file exists
//         if(!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No such file exists'
//             });
//         }

//         if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
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

// // DELETE request to find all files of a certain type and delete them all
// // app.delete('/delete/:collection', (req, res) => {
// //     gfs.collection(req.params.collection);
// //     gfs.files.find.delete((err, files) => {
// //         //Check if files exist  
// //         if(!files || files.length === 0) {
// //             return res.status(404).json({
// //                 err: req.params.collection
// //             }); 
// //         }
// //         // Files exist
// //         return res.json(files);
// //     })
// // })

// // DELETE request to find one file and delete
// app.delete('/delete/:collection/:filename', (req, res) => {
//     gfs.collection(req.params.collection).remove({filename: req.params.filename}, function (err) {
//         if (err) console.log(err);
//         console.log('success'); 
//       });
// })


// const port = 3000;

// app.listen(port, () => console.log(`app has started on port ${port}`));