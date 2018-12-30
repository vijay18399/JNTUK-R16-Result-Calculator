var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/result');
var supply = db.get('supply');
var sem1 = db.get('sem1');
var sem2 = db.get('sem2');
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
router.get('/', function(req, res, next) {
  res.render('result');
});
router.post('/get_result', function (req, res) {
  console.log(req.body.ht_no);
  var ht_no = req.body.ht_no;
  sem1.find({
    "Htno": ht_no
  }, function (err, results) {
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
module.exports = router;
