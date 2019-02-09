const express = require('express');
const router = express.Router();
const post = require('../../models/post');
const catalog = require('../../models/catalog');
const category = require('../../models/category');
const mongoose = require('mongoose');
const global = require('../../global');
var ObjectId = require('mongoose').Types.ObjectId;
const requireAuth = require('../../middlewares/require_authentication');
var mongoosePaginate = require('mongoose-paginate');
//const postsController = require('../../controllers/posts-controller'); 
router.post('/add-post', requireAuth, (req, res) => {
    var postNew = new post({
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
    post.paginate({}, options, function(err, posts) {
        if (!err) {
            var objResult = {
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
            var postCustom = post.toObject();
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
    post.find({}, {}, { sort: { createdAt: -1 }, limit: 8 }, function (err, items) {
        if (!err) {
            res.send(items);
        }
        else {
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));
        }
    });
});
// get item in catalog by catalogId
router.get('/get-catalog-posts/:id', (req, res) => {
    post.find({ 'catalogId': req.params.id }, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.get("/search-posts/", async function (req, res) {
    var query = {};
    var isExistCategorySearch = false;
    for (var key in req.body) { //could also be req.query and req.params
        if (!global.isNullOrUndefinedOrEmpty(req.body[key])) {
            if (key === "provinceCityId" || key === "districtTownId") {
                var keyAlterName = 'address' + '.' + key;
                query[keyAlterName] = req.body[key];
            } else if (key !== "title") {
                query[key] = req.body[key];
            } else {
                const regex = new RegExp(global.escapeRegex(req.body[key]), 'gi');
                query[key] = regex;
            }
            if (key === "categoryId") {
                isExistCategorySearch = true;
            }

        }
    }
    if (isExistCategorySearch) {
        category.find({ parentId: req.body.categoryId }).select({ "categoryId": 1 }).exec(function (err, categories) {
            if (!err) {
                var arrCategoryId = [];
                arrCategoryId = categories.map(x => x.categoryId);
                arrCategoryId.push(req.body.categoryId);
                post.find(query).where('categoryId').in(arrCategoryId).exec(function (err, posts) {
                    if (!err) {
                        res.send(posts);
                    } else {
                        console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));
                    }
                });
            } else {
            }
        });
    } else {
        post.find(query).exec(function (err, posts) {
            if (!err) {
                res.send(posts);
            } else {
                console.log('Error in Retriving post :' + JSON.stringify(err, undefined, 2));
            }
        });
    }

});



module.exports = router;