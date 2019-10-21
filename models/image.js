const mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    image_url: String,
    album: String,
    order: Number,
    userId: String,
    public_id: String
})

module.exports = mongoose.model('Image', ImageSchema)