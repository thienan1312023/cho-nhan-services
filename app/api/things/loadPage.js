const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
const ProvinceCity = require('../../models/provincecity');
const postsController = require('../../controllers/posts-controller');
router.post('/search-load-page', async (req, res) => {
    let categoryRes = await Category.findOne({ $text: { $search: req.body.categorySearch } });
    let provinceCityRes = await ProvinceCity.findOne({ $text: { $search: req.body.provinceCity } });
    let result = {
        category: categoryRes,
        provinceCity: provinceCityRes,
    }
    if (!categoryRes || !provinceCityRes) {
        res.send("get filter data fail");
    } else {

        let body = {
            highLevelArr: result.category.categoryId,
            provinceCityId: result.provinceCity.ProvinceCityId
        };
        const postsResult = await postsController.searchPosts(body);
        if (postsResult) {
            res.send(postsResult);
        } else {
            res.status(500).send('Error while search posts');
        }
    }
});
module.exports = router;

