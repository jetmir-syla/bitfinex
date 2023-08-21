const fs = require("fs");

let myParameter;

function initialize() {
  try {
    myParameter = fs.readFileSync("helper/parameter.txt", "utf8");
  } catch (err) {
    console.error("Error loading parameter:", err);
    myParameter = 0;
  }
}

function updateParameter(newValue) {
  myParameter = newValue;
  saveParameterToFile();
}

function saveParameterToFile() {
  fs.writeFileSync("helper/parameter.txt", myParameter);
}

initialize(); // Load the initial parameter value from the file

module.exports = {
  myParameter,
  updateParameter
};
