const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
const ProvinceCity  = require('../../models/provincecity');

router.get('/search-load-page', async (req, res) => {
    let categoryRes = await Category.findOne({$text: {$search: req.body.categorySearch}});
    let provinceCityRes = await ProvinceCity.findOne({$text: {$search: req.body.provinceCity}});
    let result = {
        category : categoryRes,
        provinceCity: provinceCityRes,
    }
    if(!categoryRes || !provinceCityRes){
        res.send("get filter data fail");
    }else{
        res.send(result);
    }
    
});
module.exports = router;

