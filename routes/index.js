var express = require('express');
var router = express.Router();
var monk=require('monk');
var db=monk('localhost:27017/exam');
var admin=db.get('admin');
var status=db.get('status');
var urls=db.get('urls');
var messages=db.get('messages');
var schedule=db.get('schedule');
var resultrecords=db.get('resultrecords');
var pdf2table = require('pdf2table');
var fs = require('fs');
var multer = require('multer');
const moment = require('moment');

//----Uploading Code
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, 'public/results/')
  },
  filename: function (req, file, cb) {
    //var datetimestamp = Date.now();
    cb(null, file.originalname)
  }
});
var upload = multer({
  storage: storage
})

router.post('/login',function(req,res){
  console.log(req.body.username);
  console.log(req.body.password);
  var data={
    username : req.body.username,
    password : req.body.password
  }
  admin.findOne(data, function(err,docs){
    if(docs){
      delete docs.password;
        req.session.user=docs;
        console.log('success');
        res.redirect('/admin');
    }
    else{
      console.log('fail');
      res.render('login', {err:'Invalid login credentials', title: 'CSR'})
    }
  });
});

router.post('/result', upload.single('pdf'), function (req, res) {
console.log(moment().format('DD/MM/YYYY'));
  console.log(req.body.semester);
  console.log(req.file.originalname);
  var date=moment().format('DD/MM/YYYY');
  var semester = req.body.semester;
  pdfloc = './public/results/' + req.file.originalname;
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
               "Semester":semester,
                "Date":date
            }
          
         resultrecords.insert(data, function (err, docs) {
                  console.log(docs);
                });

     
            
        }
      }

    }
  });
  res.redirect('/admin');

}); });



router.get('/admin', function(req, res, next) {
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    console.log(req.session.user._id);
 status.find({},function(err,status){
   schedule.find({},function(err,schedule){
    messages.find({},function(err,messages){    
         urls.find({},function(err,urls){ 
        res.locals.status = status;
         res.locals.schedule = schedule;
      res.locals.messages = messages;
     res.locals.urls = urls;

 
     res.render('home');
     });  }); }); });
  }
  else{
    req.session.reset();
    res.redirect('/adminlogin');
  }
});


/* GET home page. */
router.get('/adminlogin', function(req, res, next) {
  res.render('index');
});

router.post('/myresult', function (req, res) {
  console.log(req.body.ht_no);
console.log(req.body.Semester);
  var ht_no = req.body.ht_no;
var Semester=req.body.Semester;
    data={
     "Htno": ht_no  ,
        "Semester" : Semester.trim()
    }
    console.log(data);
resultrecords.find(data, function (err, results) {
    console.log(results);
    res.render('finalresult', {
      'results': results,'Semester':Semester
    });
  });
});
router.get('/', function(req, res, next) {
 status.find({},function(err,status){
   schedule.find({},function(err,schedule){
    messages.find({},function(err,messages){   
     urls.find({},function(err,urls){  
        res.locals.status = status;
         res.locals.schedule = schedule;
      res.locals.messages = messages;
      res.locals.urls = urls;
  res.render('portal');

}); }); }); });
});

router.get('/@18399', function(req, res, next) {
  res.render('register');
});
router.get('/1-1', function(req, res, next) {
  res.render('getresult',{Semester:'1-1'});
});
router.get('/1-2', function(req, res, next) {
  res.render('getresult',{Semester:'1-2'});
});
router.get('/2-1', function(req, res, next) {
  res.render('getresult',{Semester:'2-1'});
});
router.get('/2-2', function(req, res, next) {
  res.render('getresult',{Semester:'2-2'});
});
router.get('/3-1', function(req, res, next) {
  res.render('getresult',{Semester:'3-1'});
});
router.get('/3-2', function(req, res, next) {
  res.render('getresult',{Semester:'3-2'});
});
router.get('/4-1', function(req, res, next) {
  res.render('getresult',{Semester:'4-1'});
});
router.get('/4-2', function(req, res, next) {
  res.render('getresult',{Semester:'4-2'});
});

router.get('/supply', function(req, res, next) {
  res.render('getresult',{Semester:'supply'});
});

router.post('/register',function(req,res){
    var data={ fullname:req.body.fullname,
    	         username:req.body.username,
    	         email:req.body.email,
    	         password:req.body.password
             }
    admin.insert(data,function(err,docs){
  
    if(err)
  {
    console.log(err);
  }
  else
  {
    console.log(docs);

  }
  res.redirect('/adminlogin')
    
});
});

//status
router.post('/status', upload.single('image'), function(req, res) {
  
    var data = {
        semester : req.body.semester,
         Stream : req.body.Stream,
          Category : req.body.Category,
          Status : req.body.Status
      
    
    }
    status.insert(data, function(err,data){
    res.redirect('/admin');
    });
});
router.post('/edit_status', function(req, res) {
    console.log(req.body.sno);
    var id = req.body.sno;
    status.find({"_id":id}, function(err,docs){
        console.log(docs);
         res.send(docs);
    });
});
router.post('/remove_status', function(req, res) {
    console.log(req.body.sno);
    var id = req.body.sno;
    status.remove({"_id":id}, function(err,docs){
        console.log(docs);
      res.send(docs);
    });
});
router.post('/update_status', function(req, res) {
    console.log(req.body.Status);
  var data = {
    Status : req.body.Status     }
  status.update({"_id":req.body.id},{$set:data}, function(err,docs){
    console.log(docs);
    res.redirect('/admin');
  });
});

//schedule
router.post('/schedule', upload.single('attachment'), function(req, res) {
  
    var data = {
        semester : req.body.semester,
         Stream : req.body.Stream,
         examtype : req.body.examtype,
          Category : req.body.Category,
          Status : req.body.Status,
      file :'results/' + req.file.originalname
    
    }
    schedule.insert(data, function(err,data){
    res.redirect('/admin');
    });
});

router.post('/remove_schedule', function(req, res) {
    console.log(req.body.sno);
    var id = req.body.sno;
    schedule.remove({"_id":id}, function(err,docs){
        console.log(docs);
      res.send(docs);
    });
});
//contact Us
router.post('/message', function(req, res) {
  
    var data = {
        name : req.body.name,
         email : req.body.email,
          message : req.body.message
 
    }
    messages.insert(data, function(err,data){
    res.redirect('/');
    });
});
router.post('/remove_message', function(req, res) {
    console.log(req.body.sno);
    var id = req.body.sno;
    messages.remove({"_id":id}, function(err,docs){
        console.log(docs);
      res.send(docs);
    });
});
//urls
router.post('/add_url', function(req, res) {
  
    var data = {
        semester : req.body.semester,
         Stream : req.body.Stream,
 
          Category : req.body.Category,
          url : req.body.url

    
    }
    urls.insert(data, function(err,data){
    res.redirect('/admin');
    });
});

router.post('/remove_url', function(req, res) {
    console.log(req.body.sno);
    var id = req.body.sno;
    urls.remove({"_id":id}, function(err,docs){
        console.log(docs);
      res.send(docs);
    });
});
//delte records
router.post('/delete_record', function(req, res) {
    console.log(req.body.sno);
    var id = req.body.sno;
    resultrecords.remove({"Semester":id}, function(err,docs){
   res.redirect('/admin');
    });
});
module.exports = router;
