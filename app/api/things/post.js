const express = require('express');
var router = express.Router();
var post = require('../../models/post');
var catalog = require('../../models/catalog');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
router.post('/add-post', (req, res) => {    
    var postNew = new post({
        user:  ObjectId(req.currentUserId),
        postType: req.body.postType,
        userType: req.body.userType,
        imagePathList: req.body.imagePathList,
        description: req.body.description,
        title: req.body.title,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        note: req.body.note,    
        categoryId: req.body.categoryId,
        catalogId: req.body.catalogId,
        postStatus: req.body.postStatus,
        createdBy: req.currentUserId,
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

    post.findById(req.params.id).populate('user').exec(function (err, post) {    
        if(!err){
            var postCustom = post.toObject();
            if(post){
                catalog.findOne({'catalogId': post.catalogId}).exec(function (err, catalog){
                    if(catalog){
                    postCustom.catalogName = catalog.catalogName;
                    res.send(postCustom);
                    }
                    else{
                        res.send(err);
                    }      
                });
            }
        }else{
            console.log(post);
        }
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
// get item in catalog by catalogId
router.get('/get-catalog-posts/:id', (req, res) => {
    post.find({'catalogId': req.params.id}, (err, docs) =>{
       if(!err){
            res.send(docs);
       }else{
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));    
       }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", function(req, res) {
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Jobs.find({ "name": regex }, function(err, foundjobs) {
           if(err) {
               console.log(err);
           } else {
              res.render("jobs/index", { jobs: foundjobs });
           }
       }); 
    }
});
module.exports = router;