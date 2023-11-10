/* Global variables */
var _location = null;
var _cuisines = null;
var _meal = null;
var _price =  null;
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
    axios.get(_dataFile, {responseType: 'blob'})
       .then(function (response) {
           // handle success
          console.log(response);
           parseDataAndSearch(response.data);
      })
      .catch(function (error) {
          // handle error
          console.log(error);
      })
      .finally(function () {
          // always executed
      });
}

/*
    Handles locally uploaded data file - only used for testing
*/
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
    The main method to load the data source, translate it into JSON object, and search.
    The results (exact or partial match) will then be displayed on the page.
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
                        '<div class="card">' +
                        '<div class="cardcontainer">' +
                        '<p>&nbsp;</p>' +
                        '<a class="card_header" href="' + website + '">' + row['Name'] + '</a>' +
                        '<p class="card_details">' + row['Cuisine'] + '</p>' + 
                        '</div>' + 
                        '<img src="' + row['Image'] + '" alt="">' +
                        '<div class="cardcontainer">' +
                        '<p class="card_details">' + row['Address'] + '</p>' +
                        '<p class="card_details">' + phone + '</p>' +
                        '<p>&nbsp;</p>' +
                        '</div>' +
                        '</div>' +
                        '<br/>';
                
                    }
                    else {

                        htmlData +=
                        '<div class="card">' +
                        '<div class="cardcontainer">' +
                        '<p>&nbsp;</p>' +
                        '<a class="card_header" href="' + website + '">' + row['Name'] + '</a>' +
                        '<p class="card_details">' + row['Cuisine'] + '</p>' + 
                        '</div>' + 
                        '<img src="' + row['Image'] + '" alt="">' +
                        '<div class="cardcontainer">' +
                        '<p class="card_details">' + row['Address'] + '</p>' +
                        '<p class="card_details">' + phone + '</p>' +
                        '<p>&nbsp;</p>' +
                        '</div>' +
                        '</div>' +
                        '<br/>';
                    }
                }

                var divResult = document.getElementById('resultcards');
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

    // Couldn't find exact matches
    if (result == null || result.length <= 0) {

        var divNoMatch = document.getElementById('nomatch');
        var htmlData =
            '<br />' +
            '<p class="card_details">Ooops! It does not look like we found a match for your search. Here is a list of alternative places you can visit instead.</p>';
        divNoMatch.innerHTML = htmlData;

        // Returning a result of places matched by Suburb, Meal Type, and Price Range - ignoring Cuisine
        result = _matchedBySuburb;
    }

    return result;
}



