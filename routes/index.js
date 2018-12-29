var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/result');
var table=db.get('table');
var pdf2table = require('pdf2table');
var fs = require('fs');
/* GET home page. */
router.post('/get_result', function(req, res) {
    console.log(req.body.ht_no);
    var ht_no = req.body.ht_no;
  table.find({"Htno":ht_no}, function(err,results){
         res.render('result', {'results' : results});    
       });
    
     
    });
router.get('/upload', function(req, res, next) {
    fs.readFile('./public/file.pdf', function (err, buffer) {
    if (err) return console.log(err);
 
    pdf2table.parse(buffer, function (err, rows, rowsdebug) {
        if(err) return console.log(err);
 
       

     for(i = 1; i < rows.length; i += 1)
         { if(rows[i].length == 5)
             { 
             console.log(rows[i]);
          

           if(rows[i][3]== 'O' || rows[i][3]== 'S' || rows[i][3]=='A' ||rows[i][3]==rows[i][3]=='B' ||rows[i][3]== 'C' ||rows[i][3]== 'D' ||rows[i][3]== 'F' || rows[i][3]=='ABSENT' )
              {
                 
              data = {
                 "Htno" :rows[i][0],
                  "Subcode" : rows[i][1],
                  "Subname":rows[i][2],
                  "Grade" :rows[i][3],
                  "Credits":rows[i][4]

                 }
            
    
           table.insert(data, function(err,docs){
    console.log(docs);
             
         });  }
              }
                        }
        res.render('index', { title: 'Express' });
    });
});
  
});
router.get('/', function(req, res) {
   
  res.render('index');

});
 

module.exports = router;
