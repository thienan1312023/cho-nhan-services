const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const Catalog  = require('../../models/catalog');
const requireAuth = require('../../middlewares/require_authentication');
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
router.post('/add-catalog', requireAuth,  (req, res) => {
    
    var catalogNew = new Catalog({
        catalogId: req.body.catalogId,
        catalogName: req.body.catalogName,
        imagePath: req.body.imagePath
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
router.put('/:id', requireAuth, async(req, res) => {
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

router.delete('/:id', requireAuth, (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Catalog Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;