var express = require('express');
var router = express.Router();
const requireAuth = require('../middlewares/require_authentication');

router.use('/catalog', requireAuth, require('./things/catalog'));
router.use('/category', requireAuth, require('./things/category'));
router.use('/post', require('./things/post'));
router.use('/user', require('./user/user'));
module.exports = router;