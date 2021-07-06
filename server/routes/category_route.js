const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const categoryModel = require('../models/Category');
const Error = require('../utils/error_response');

//Insert
router.post('/category/categoryinsert', (req, res, next) => {
    const category = new categoryModel(req.body);

    category.save((err) => {
        if(err){
            return next(new Error('Something went wrong!. Please check and try again.', 400));
        }
        return res.status(201).json({
            success:[true , 'Added Successfully']
        });
    });
});

//Retrive
router.get('/category/categories', (req,res,next) => {
    categoryModel.find().exec((err, categories) => {
        if(err){
            return next(new Error('Can not find any category!', 400));
        }
        return res.status(200).json({
            success:true,
            categories
        });
    });
});

//Get specific data
router.get('/category/categorydata/:id',(req,res) =>{
    const categoryid = req.params.id;
    categoryModel.findById(categoryid,(err, category) => {
        if(err){
            return next(new Error("Can not find a category with this id...!",400));
        }
        return res.status(200).json({
            success:true,
            category
        });
    })
})


//Update
router.put('/category/updatecategory/:id', (req, res, next) => {
    
    categoryModel.findByIdAndUpdate(req.params.id, {
        $set:req.body
    },
    (err, category) => {
        if(err){
            return next(new categoryModel('Can not update the data!', 400));
        }
        
        return res.status(200).json({
            success:'Succussfully updated.'
        });
    });
});

//Delete
router.delete('/category/deletecategory/:id', (req, res, next) => {
    categoryModel.findByIdAndRemove(req.params.id).exec((err, deletecategory) => {
        if(err){
            return next(new Error('Can not delete the data', 400));
        }
        return res.status(200).json({
            success:[true, " Deleted successfully!"],
            deletecategory
        });
    }); 
});

module.exports = router;