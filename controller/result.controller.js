// Import necessary packages
var pdf2table = require("pdf2table");
var fs = require("fs");
var utils = require("../utils/pdf-table-processor");
var monk = require("monk");
var db = monk("0.0.0.0:27017/exam");
var resultUploads = db.get("resultUploads");

// Define a function to handle POST requests to upload PDF results
exports.postResult = (req, res, next) => {
  // Read the uploaded PDF file
  pdfloc = "./public/uploads/" + req.file.filename;
  buffer = fs.readFileSync(pdfloc);
  try {
  // Parse the PDF file using pdf2table
  pdf2table.parse(buffer, function (err, rows, rowsdebug) {
    // If there are no rows or an error occurs, return an error message
    if (rows.length == 0 || err) {
      res.status(500).json({
        msg: "Not a Valid PDF",
      });
    }
    // Clean up the extracted rows
    resultrecords = utils.cleanRows(rows);
    
    // Extract some specific data from the rows
    resultText = rows[1][0] ? rows[1][0].trim() : "";
    college = rows[1][1] ? rows[1][1].trim() : "";
    checkText = rows[0][0] ? rows[0][0].trim() : "";
    
    // If the extracted data is not valid, return an error message
    if (
      checkText != "JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY KAKINADA" ||
      resultrecords.length == 0
    ) {
      res.status(500).json({
        msg: "Not Valid PDF",
      });
    } else {
      // Insert the extracted data into the database
      resultUploads.insert(
        {
          resultText: resultText,
          resultrecords: resultrecords,
          collegeName: college,
          date: new Date(),
        },
        function (err, docs) {
          // If there is an error inserting data, return an error message
          if (err) {
            res.status(500).json({
              msg: "Unable to Process Data",
            });
          }
          // If data is inserted successfully, return the document ID
          if (docs) {
            console.log(docs._id, docs);
            res.status(201).json({
              id: docs._id,
            });
          }
        }
      );
    }
  });

  }
  catch(err){
    res.status(500).json({
        msg: "Error while processing PDF",
      });
  }
  finally {
    // delete the file in both success and error cases
    fs.unlinkSync(pdfloc);
  }
};

// Define a function to handle GET requests to retrieve PDF results
exports.getResult = (req, res, next) => {
  console.log(req.params, req.body);
  // Find the document in the database with the specified ID
  resultUploads.findOne({ _id: req.params.id }, function (err, docs) {
    // If the document is found, render a page with the requested data
    if (docs) {
      res.render("result", {
        id: req.params.id,
        isPost: true,
        records: docs.resultrecords.filter(
          (item) => item.htno === req.body.roll_number
        ),
        roll_number: req.body.roll_number,
      });
    } 
    // If the document is not found, render a page with no data
    else {
      res.render("result", {
        id: req.params.id,
        isPost: true,
        records: [],
        roll_number: req.body.roll_number,
      });
    }
  });
};
``
