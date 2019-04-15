const express = require('express');
const router = express.Router();
const Province  = require('../../models/provincecity');

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