const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {requireLoggedIn} = require('../../jsonWebToken/middleware.js');

// router.get('/all/:page',requireLoggedIn,async (req,res) =>{
//     await controller.getAll(req,res);
// });

// router.get('/search/:id',requireLoggedIn,async (req,res)=>{
//     await controller.getSearchId(req,res);
// });

router.post('/',requireLoggedIn, async (req,res)=>{
    await controller.postRoot(req,res);
});

module.exports = router;