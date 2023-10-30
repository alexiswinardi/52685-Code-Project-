/* Global variables */
var _location = 'Chatswood';
var _cuisines = 'Japanese, Korean';
var _meal = 'Dinner';
var _price = '$$';
var _dataFile = '[52685] Database.xlsx';
var _json_restaurants;

function formLoad() {

    //Get all the items from localStorage created by the GetStarted page

    //document.getElementById("location").innerText = localStorage.getItem("_locationInput");
    //document.getElementById("cuisines").innerText = localStorage.getItem("_selectedCuisine");
    //document.getElementById("meal").innerText = localStorage.getItem("_selectedMealType");
    //document.getElementById("price").innerText = localStorage.getItem("_selectedPriceRange");

    /* Read datafile online */   
    axios.get(_dataFile)
        .then(function (response) {
            // handle success
           console.log(response);
       })
       .catch(function (error) {
           // handle error
           console.log(error);
       })
       .finally(function () {
           // always executed
           console.log('parse');
       });
}

function upload() {
    var files = document.getElementById('file_upload').files;
    if (files.length == 0) {
        alert("Please choose any file...");
        return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX') {
        //Here calling another method to read excel file into json
        excelToJSONToObject(files[0]);
    } else {
        alert("Please select a valid excel file.");
    }
}

/*
    Sample output:
    
    0: 
        Address: "125 Falcon St, Crows Nest NSW 2065"
        Cuisine: "Japanese"
        Id: 1
        Name: "Ryo's Noodles"
        Phone number: "(02) 9955 0225"
        Postcode: 2065
        Website link: "https://www.facebook.com/ryosnoodles/"
        __rowNum__: 1
    1:  
        Address: "346B Illawarra Rd, Marrickville NSW 2204"
        Cuisine: "Vietnamese"
        Id: 2
        Name: "Pho Ha Noi Quan Marrickville"
        Phone number: "(02) 8018 4928"
        Postcode: 2204
        Website link: "https://www.quandoo.com.au/place/pho-ha-noi-quan-32082?aid=63"
        __rowNum__: 2
*/

function excelToJSONToObject(file) {

    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            var result = {};
            var firstSheetName = workbook.SheetNames[1];
            //reading only first sheet data
            _json_restaurants = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            //displaying the json result into HTML table
            //displayJsonToHtmlTable(jsonData);
        }
    } catch (e) {
        console.error(e);
    }
}




