// This function takes an array of rows as input, and returns an array of objects containing only the relevant fields.
exports.cleanRows = function (rows) {
  // Initialize an empty array to store the cleaned data.
  result_records = [];

  // Iterate over each row, starting from the second row (i.e., index 1).
  for (i = 1; i < rows.length; i += 1) {
    // Check if the row has 5 columns, which is the expected number of columns for a valid record.
    if (rows[i].length == 5) {
      // Check if the grade field contains a valid value (O, S, A, B, C, D, F, or ABSENT).
      if (
        rows[i][3].trim() == "O" ||
        rows[i][3].trim() == "S" ||
        rows[i][3].trim() == "A" ||
        rows[i][3].trim() == "B" ||
        rows[i][3].trim() == "C" ||
        rows[i][3].trim() == "D" ||
        rows[i][3].trim() == "F" ||
        rows[i][3].trim() == "ABSENT"
      ) {
        // Create an object for the current record, with the relevant fields.
        resultrecord = {
          htno: rows[i][0],
          subcode: rows[i][1],
          subname: rows[i][2],
          grade: rows[i][3],
          credits: rows[i][4],
        };

        // Add the object to the collection of cleaned records.
        result_records.push(resultrecord);
      }
    }
  }

  // Return the cleaned collection of records.
  return result_records;
};
