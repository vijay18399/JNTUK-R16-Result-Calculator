// Import the Express framework and create a new Router object
var express = require('express');
var router = express.Router();

// Import middleware and controllers
const upload = require("../middleware/upload");
const ResultController = require("../controller/result.controller");

// Define routes using HTTP methods

// GET request to the root URL renders the "upload" view
router.get('/', function(req, res, next) {
  res.render('upload');
});

// POST request to the "/upload" URL handles file uploads using the "upload" middleware 
// and invokes the "postResult" function from the ResultController
router.post("/upload", upload.single("pdf"), ResultController.postResult);

// GET request to the "/links/:id" URL renders the "links" view, passing in the ID parameter
router.get('/links/:id', function(req, res, next) {
  res.render('links',{id: req.params.id  });
});

// GET request to the "/result/:id" URL renders the "result" view, passing in the ID parameter
// and a flag "isPost" set to false
router.get('/result/:id', function(req, res, next) {
  res.render('result',{id: req.params.id ,isPost : false   });
});

// POST request to the "/result/:id" URL handles a form submission using the "getResult" function 
// from the ResultController, passing in the ID parameter
router.post('/result/:id', ResultController.getResult);

// Export the router object to be used in other parts of the application
module.exports = router;
