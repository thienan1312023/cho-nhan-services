const express = require('express');
var router = express.Router();
var post = require('../../models/post');
const mongoose = require('mongoose');
// create catalog
router.post('/add-post', (req, res) => {    
    var postNew = new post({
        user:  new mongoose.Types.ObjectId(),
        postType: req.body.postType,
        userType: req.body.userType,
        imagePathList: req.body.imagePathList,
        description: req.body.description,
        title: req.body.title,
        address: req.body.address,
        note: req.body.note,    
        categoryId: req.body.categoryId,
        catalogId: req.body.catalogId,
        postStatus: req.body.postStatus,
        createdBy: "",
        updatedBy: "",
        createdAt: new Date(),
        updatedAt: ""
    });
    postNew.save((err, doc) => {
        if (!err) { 
            res.send(doc); 
            console.log("Save successfully");
        }
        else { console.log('Error in Category Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/', (req, res) => {
    post.find((err, docs) => {
        if (!err) {
             res.send(docs); 
        }
        else { 
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2)); 
        }
    });
    
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    post.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });
});
// update post
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var post = {
        imagePath: req.body.imagePath,
        title: req.body.title,
        categoryId: req.body.categoryId,
        description: req.body.description,
    };
    post.findByIdAndUpdate(req.params.id, { $set: post }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in post Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    post.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in post Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});
// get 8 newest items
router.post('/get-new-posts', (req, res) => {
    post.find({}, {}, {sort: {createdAt: -1}, limit: 8}, function(err, items){
        if(!err){
            res.send(items);
        }
        else{
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));    
        }
    });
});
module.exports = router;