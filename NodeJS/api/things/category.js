const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Category = require('../../models/category')

// create catalog
router.post('/add-category', (req, res) => {
    
    var categoryNew = new Category({
        categoryName: req.body.categoryName,
        parentId: req.body.parentId
    });
    categoryNew.save((err, doc) => {
        if (!err) { 
            res.send(doc); 
            console.log("Save successfully");
        }
        else { console.log('Error in Category Save :' + JSON.stringify(err, undefined, 2)); }
    });
})

function createIdForAddNewCategory(){
    
}
router.get('/', (req, res) => {
    Category.find((err, docs) => {
        if (!err) {
             res.send(docs); 
        }
        else { 
            console.log('Error in Retriving Category :' + JSON.stringify(err, undefined, 2)); 
        }
    });
    
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Category.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });
});
// update Category
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var Category = {
        imagePath: req.body.imagePath,
        title: req.body.title,
        categoryId: req.body.categoryId,
        description: req.body.description,
    };
    Category.findByIdAndUpdate(req.params.id, { $set: Category }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Category Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    // debugger;
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Category.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Category Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;