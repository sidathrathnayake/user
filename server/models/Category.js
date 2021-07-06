const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:[ true ,'Insert a category name'],
        unique:true
    }
});

module.exports = mongoose.model('categories' , categorySchema);