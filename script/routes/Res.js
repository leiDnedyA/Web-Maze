const express = require('express');
const router = express.Router();
const resolve = require('path').resolve;

router.get('/:fileName', (req, res)=>{

    res.sendFile(resolve(`res/${req.params.fileName}`));

});

module.exports = router;