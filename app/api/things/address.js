const express = require('express');
var router = express.Router();
var Province  = require('../../models/provincecity');

router.get('/get-all-provincecity', (req, res) => {
    Province.find((err, docs) => {
        if (!err) {
             res.send(docs); 
        }
        else { 
            console.log('Error in Retriving Province :' + JSON.stringify(err, undefined, 2)); 
        }
    });
    
});
module.exports = router;