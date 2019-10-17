const mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    image_url: String,
    album: String,
    order: Number,
    userId: String
})

module.exports = mongoose.model('Image', ImageSchema)