const express = require('express');
const router = express.Router();
const post = require('../../models/post');
const catalog = require('../../models/catalog');
const category = require('../../models/category');
const mongoose = require('mongoose');
const global = require('../../global');
const ObjectId = require('mongoose').Types.ObjectId;
const requireAuth = require('../../middlewares/require_authentication');
const mongoosePaginate = require('mongoose-paginate');
const postController = require('../../controllers/posts-controller');
//const postsController = require('../../controllers/posts-controller'); 
router.post('/add-post', requireAuth, (req, res) => {
    let postNew = new post({
        user: ObjectId(req.currentUserId),
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
    const { page, perPage } = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 20,
    };
    post.paginate({}, options, function (err, posts) {
        if (!err) {
            let objResult = {
                posts: posts.docs,
                totalPages: posts.pages
            }
            res.send(objResult);
        }
        else {
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.get('/search-by-id/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    post.findById(req.params.id).populate('user').exec(function (err, post) {
        if (!err) {
            let postCustom = post.toObject();
            if (post) {
                catalog.findOne({ 'catalogId': post.catalogId }).exec(function (err, catalog) {
                    if (catalog) {
                        postCustom.catalogName = catalog.catalogName;
                        res.send(postCustom);
                    }
                    else {
                        res.send(err);
                    }
                });
            }
        } else {
            console.log(post);
        }
    });
});
// update post
router.put('/update-by-id/:id', requireAuth, (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    let post = {
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
    post.find({}, {}, { sort: { createdAt: -1 }, limit: 8 }, function (err, items) {
        if (!err) {
            res.send(items);
        }
        else {
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));
        }
    });
});
// get item in catalog by categoryId
router.get('/get-similar-posts/:id', (req, res) => {
    post.find({ 'categoryId': req.params.id }, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.post("/search-posts/", async function (req, res) {
    const result = await postController.searchPosts(req.body, req.query);
    if (result) {
        res.send(result);
    } else {
        res.status(500).send('Error while search posts');
    }
});

// get 8 newest items
// router.post('/change-posts', async (req, res) => {
//     let posts = await post.find();
//     if (posts) {
//         for (let i = 0; i < posts.length; i++) {
//             let _categoryId = posts[i].categoryId;
//             const _category = await category.findOne({ categoryId: _categoryId });
//             await post.updateOne({_id: posts[i]._id}, {highLevelArr: _category.highLevelArr});
//         }
//         console.log("done");
//         res.send("xong roi do ba");
//     }
// });

router.post('/change-posts', async (req, res) => {
    let posts = await post.find().exec();
    if (posts) {
        for (const postItem of posts) {
            if (postItem && postItem.address) {
                let address = {
                    "countryId": String(postItem.address.countryId),
                    "provinceCityId": String(postItem.address.provinceCityId),
                    "districtTownId": String(postItem.address.districtTownId),
                    "communeWardId": String(postItem.address.communeWardId)
                }
                await post.updateOne({ _id: postItem._id }, {
                    "$set": {
                        "address": address
                    }
                }).exec();
                console.log(postItem);
            }
        }
    }
    console.log("done");
    res.send("xong roi do ba");
});


module.exports = router;