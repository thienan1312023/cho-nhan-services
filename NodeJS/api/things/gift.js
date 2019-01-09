const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var gift = require('../../models/gift');

// create catalog
router.post('/add-gift', (req, res) => {    
    var giftNew = new gift({
        imagePath: req.body.imagePath,
        title: req.body.title,
        description: req.body.description,
        categoryId: req.body.categoryId,
        createdBy: "thienan",
        updatedBy: "",
        createdAt: new Date(),
        updatedAt: ""
    });
    giftNew.save((err, doc) => {
        if (!err) { 
            res.send(doc); 
            console.log("Save successfully");
        }
        else { console.log('Error in Category Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/', (req, res) => {
    gift.find((err, docs) => {
        if (!err) {
             res.send(docs); 
        }
        else { 
            console.log('Error in Retriving gift :' + JSON.stringify(err, undefined, 2)); 
        }
    });
    
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    gift.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });
});
// update gift
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var gift = {
        imagePath: req.body.imagePath,
        title: req.body.title,
        categoryId: req.body.categoryId,
        description: req.body.description,
    };
    gift.findByIdAndUpdate(req.params.id, { $set: gift }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in gift Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    // debugger;
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    gift.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in gift Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});


module.exports = router;