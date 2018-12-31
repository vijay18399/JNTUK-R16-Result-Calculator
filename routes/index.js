var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/result');
var supply = db.get('supply');
var sem1 = db.get('sem1');
var dummy = db.get('dummy');
var pdf2table = require('pdf2table');
var fs = require('fs');
var multer = require('multer');
const moment = require('moment'); 

//----Uploading Code
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    //var datetimestamp = Date.now();
    cb(null, file.originalname)
  }
});
var upload = multer({
  storage: storage
})
router.get('/sem1', function(req, res, next) {
  res.render('result',{sem:'sem1'});
});
router.get('/sem2', function(req, res, next) {
  res.render('result',{sem:'sem2'});
});
router.get('/sem3', function(req, res, next) {
  res.render('result',{sem:'sem3'});
});
router.get('/sem3', function(req, res, next) {
  res.render('result',{sem:'sem3'});
});
router.get('/sem4', function(req, res, next) {
  res.render('result',{sem:'sem4'});
});
router.get('/sem5', function(req, res, next) {
  res.render('result',{sem:'sem5'});
});
router.get('/sem6', function(req, res, next) {
  res.render('result',{sem:'sem6'});
});
router.get('/sem7', function(req, res, next) {
  res.render('result',{sem:'sem7'});
});
router.get('/sem8', function(req, res, next) {
  res.render('result',{sem:'sem8'});
});
router.get('/supply', function(req, res, next) {
  res.render('result',{sem:'supply'});
});
router.post('/get_result', function (req, res) {
  console.log(req.body.ht_no);
console.log(req.body.sem);
  var ht_no = req.body.ht_no;
var sem=req.body.sem;
    data={
     "Htno": ht_no  ,
        "sem" : sem.trim()
    }
    console.log(data);
sem1.find(data, function (err, results) {
    console.log(results);
    res.render('index', {
      'results': results
    });
  });
});
router.get('/admin', function(req, res, next) {
  res.render('admin');
});
router.post('/upload', upload.single('pdf'), function (req, res) {
console.log(moment().format('DD/MM/YYYY'));
  console.log(req.body.sem);
  console.log(req.file.originalname);
  var date=moment().format('DD/MM/YYYY');
  var sem = req.body.sem;
  pdfloc = './public/uploads/' + req.file.originalname;
  //start
  fs.readFile(pdfloc, function (err, buffer) {
    if (err) return console.log(err);

    pdf2table.parse(buffer, function (err, rows, rowsdebug) {
      if (err) return console.log(err);
      console.log(rows);


      for (i = 1; i < rows.length; i += 1) {
        if (rows[i].length == 5) {


          if (rows[i][3].trim() == 'O' || rows[i][3].trim() == 'S' || rows[i][3].trim() == 'A' || rows[i][3].trim()  == 'B' ||
         rows[i][3].trim() == 'C' || rows[i][3].trim() == 'D' || rows[i][3].trim() == 'F' || rows[i][3].trim() == 'ABSENT') {

            data = {
              "Htno": rows[i][0],
              "Subcode": rows[i][1],
              "Subname": rows[i][2],
              "Grade": rows[i][3],
              "Credits": rows[i][4],
               "sem":sem,
                "date":date
            }
          
         sem1.insert(data, function (err, docs) {
                  console.log(docs);
                });

     
            
        }
      }

    }
  });
  res.redirect('/admin');

}); });

router.post('/delete', function(req, res) {
    //console.log(req.body.sno);
    var id = req.body.sno;
    sem1.remove({"sem":id}, function(err,docs){
   
      res.send(docs);
    });
});

router.get('/some', function(req, res, next) {

  res.render('delete');
});
router.get('/adminpanel', function(req, res, next) {
      dummy.find({}, function(err,docs){
    res.locals.dummies=docs;
    
  

  res.render('adminpage1');    });
});
router.get('/homepage', function(req, res, next) {

  res.render('homepage');
});
router.post('/dummy', upload.single('image'), function(req, res) {
    console.log(req.body.name);
    var data = {
        name1 : req.body.name1,
         name2 : req.body.name2,
          name3 : req.body.name3,
        fileloc : 'uploads/' + req.file.originalname
    }
    dummy.insert(data, function(err,data){
    console.log(data);
    res.redirect('/adminpanel');
    });
});
router.post('/editdummy', function(req, res) {
    console.log(req.body.sno);
    var id = req.body.sno;
    dummy.find({"_id":id}, function(err,docs){
        console.log(docs);
      res.send(docs);
    });
});
router.post('/removedummy', function(req, res) {
    //console.log(req.body.sno);
    var id = req.body.sno;
    dummy.remove({"_id":id}, function(err,docs){
        //console.log(docs);
      res.send(docs);
    });
});
module.exports = router;
