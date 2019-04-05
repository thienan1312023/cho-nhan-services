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
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Category.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Category Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

// get 8 newest items
router.post('/change-parent', async (req, res) => {
    categorys = await Category.find();
    if (categorys) {
        for (let i = 0; i < categorys.length; i++) {
            // let category_found = categorys.find(function (category) {
            //     return category.categoryId === categorys[i - 1].parentId;
            // });
            let curCategory = categorys[i];
            let parentId = curCategory.parentId;
            let category_found = await categorys.find(item => {
                return item.categoryId == parentId && item._id != curCategory._id
            });

            if (category_found) {
                if (parentId !== 0) {
                    let arrHighLevelResult = [];
                    // let item = { ...categorys[i - 1] };
                    // arrHighLevelResult.push(item._doc.parentId);
                    // await Category.findByIdAndUpdate(item._doc._id,
                    //     { "$push": { highLevelArr: item._doc.parentId } },
                    //     { "new": true, "upsert": true }
                    // );
                    arrHighLevelResult.push(2);
                    // await Category.findByIdAndUpdate(item._doc._id,
                    //     { $push: {highLevels:  {$each:[2,3]}}},
                    //     { new: true, upsert: true }
                    // );

                    let category = await Category.findById(curCategory._id);
                    let objUpdate = {
                        upsert: true,
                        new: true,
                        highLevelArr: arrHighLevelResult
                    }
                    category.set(objUpdate);
                    await category.save();

                    // Category.findOneAndUpdate({ categoryId: item._doc.categoryId }, {$set: { highLevelArr: arrHighLevelResult }}).exec(function(err, res){
                    //     if(!err){
                    //         console.log('category updated');
                    //     }else{
                    //         console.log('category error');
                    //     }
                    // });
                    // category = await Category.find({categoryId:item._doc.categoryId});
                    // if(category){
                    //     category.highLevelArr = arrHighLevelResult;
                    //     category.save().then(function(err, result) {
                    //         console.log('category Created');
                    //     });
                    // }else{
                    //     console.log("error")
                    // }
                    
                    //await Category.updateOne({categoryId: item._doc.categoryId }, {$set: { highLevelArr: arrHighLevelResult }});
                }
            }
        }
        res.send("dung roi haha");
    }
    else {
        console.log('Error in Retriving category :' + JSON.stringify(err, undefined, 2));
    }
});


module.exports = router;