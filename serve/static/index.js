const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', function (req, res) {
  console.log(req.url);
  res.send(fs.readFileSync('build/index.html','utf8'));
});

router.get('/login',(req,res)=>{
  res.send(fs.readFileSync('build/index.html','utf8'));
})
router.get('/home',(req,res)=>{
  res.send(fs.readFileSync('build/index.html','utf8'));
})

module.exports = router;




