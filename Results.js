/* Global variables */
var _location = 'City';
var _cuisines = 'Japanese,Korean';
var _meal = 'Dinner';
var _price = '$$';
var _dataFile = '/52685-Code-Project-/Database.xlsx';
var _json_restaurants;
var _matchedBySuburb = [];

function formLoad() {

    //Get all the items from localStorage created by the GetStarted page

    _location = localStorage.getItem("_locationInput");
    _cuisines = localStorage.getItem("_selectedCuisine");
    _meal = localStorage.getItem("_selectedMealType");
    _price = localStorage.getItem("_selectedPriceRange");

    /* Read datafile online*/
    //axios.get(_dataFile, {responseType: 'blob'})
    //    .then(function (response) {
    //        // handle success
    //       console.log(response);
    //        parseDataAndSearch(response.data);
    //   })
    //   .catch(function (error) {
    //       // handle error
    //       console.log(error);
    //   })
    //   .finally(function () {
    //       // always executed
    //   });
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
        parseDataAndSearch(files[0]);

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

function parseDataAndSearch(file) {

    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            var result = {};
            var firstSheetName = workbook.SheetNames[0];
            //reading only first sheet data
            _json_restaurants = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

            var finalList = getMatchingRestaurants();
            if (finalList != null && finalList.length > 0) {

                var htmlData = null;

                for (var i = 0; i < finalList.length; i++) {

                    var row = finalList[i];

                    var phone = '';
                    if (row['PhoneNumber'] != undefined){
                        phone = row['PhoneNumber'];
                    }

                    var website = '';
                    if (row['Website'] != undefined) {
                        website = row['Website'];
                    }

                    if (htmlData == null) {

                        htmlData =
                            '<div class="table_container">' +
                            '<table class="resulttable">' +
                            '<tr>' +
                            '<td>' +
                            '<a class="foodle_h2" style="text-align: left;" href="' + website + '">' + row['Name'] + '</a>' +
                            '</td>' +
                            '<td><label class="result_phonenumber">' + phone + '</label></td>' + 
                            '</tr>' +
                            '<tr>' +
                            '<td colspan="2">' +
                            '<div style="height: 275px">' +
                            '<img alt="" src="' + row['Image'] + '"/>' +
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '<br />';
                    }
                    else {

                        htmlData +=
                            '<div class="table_container">' +
                            '<table class="resulttable">' +
                            '<tr>' +
                            '<td>' +
                            '<a class="foodle_h2" style="text-align: left;" href="' + website + '">' + row['Name'] + '</a>' +
                            '</td>' +
                            '<td><label class="result_phonenumber">' + phone + '</label></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td colspan="2">' +
                            '<div style="height: 275px">' +
                            '<img alt="" src="' + row['Image'] + '"/>' +
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '<br />';
                    }
                }

                var divResult = document.getElementById('divResultTable');
                divResult.innerHTML = htmlData;

            }
        }
    } catch (e) {
        console.error(e);
    }
}

function getMatchingRestaurants(searchSuburb, searchCuisine, searchPriceRange) {

    var result;

    var restArray = JSON.parse(JSON.stringify(_json_restaurants));

    // Suburb, meal and price range
    for (var i = 0; i < restArray.length; i++) {

        var item = restArray[i];
        if (item['SuburbRange'].indexOf(_location) >= 0 && item['Meal'].indexOf(_meal) >= 0 && item['Price'] == _price) {

            _matchedBySuburb.push(item);
        }
    }

    //Cuisine
    result = _.filter(
        _matchedBySuburb,
        ({ Cuisine }) => _.every([
            _.includes(_cuisines.split(','), Cuisine)
        ])
    );

    if (result == null || result.length <= 0) {

        result = _matchedBySuburb;
    }

    return result;
}



