const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Catalog  = require('../../models/catalog');

router.get('/get-all-catalogs', (req, res) => {
    Catalog.find((err, docs) => {
        if (!err) {
             res.send(docs); 
        }
        else { 
            console.log('Error in Retriving Catalog :' + JSON.stringify(err, undefined, 2)); 
        }
    });
    
});
// create catalog
router.post('/add-catalog', (req, res) => {
    
    var catalogNew = new Catalog({
        name: req.body.name,
        categoryIdList: req.body.categoryIdList,
        imagePath: req.body.imagePath,
        catalogId: req.body.catalogId,
        linkDirect: req.body.linkDirect,
        createdBy: "thienan",
        updatedBy: "",
        createdAt: new Date(),
        updatedAt: ""
    });
    catalogNew.save((err, doc) => {
        if (!err) { 
            res.send(doc); 
        }
        else { console.log('Error in Catalog Save :' + JSON.stringify(err, undefined, 2)); }
    });
})
router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Catalog.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Catalog :' + JSON.stringify(err, undefined, 2)); }
    });
});
// update catalog
router.put('/:id', async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
        var ExistProduct = await Catalog.findById(req.params.id);
        if(ExistProduct){
            const error = new Error(`<span>${req.body.title}</span> product already exists`);
            error.status = 400;
            throw error;
        }

        Product.findByIdAndUpdate(req.params.id, { $set: product }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Product Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Catalog Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;