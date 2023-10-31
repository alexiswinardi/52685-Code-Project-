
/* Global variables */
var _locationInput = null;
var _selectedCuisine = [];
var _selectedMealType = null;
var _selectedPriceRange = null;

/*
    Executed when index.html is loaded
*/
function formLoad() {

    //Put stuff here that should happen when the page is loaded
    //eg: Load the data, initialise variables etc

}

/*
    Executed when the Next button under the location textbox is clicked
*/
function btn_submitLocation_OnClick() {

    // Check that the textbox is populated
    var location = document.getElementById("location_input");
    if( location == null || location.value == "" )
    {
        alert("You must enter either a suburb or a postcode");
        return false;
    }

    _locationInput = location.value;

    //Show the cuisine section
    var x = document.getElementById("sectionCuisine");

    if (x.style.display === "none") {

        x.style.display = "block";

    }
    else {

        x.style.display = "none";

    }

    //Set focus
    x.focus();

    //Hide the next button
    x = document.getElementById("divNextButton");
    x.style.display = "none";
}

/*
    Executed when the Submit button at the bottom of the GetStarted.html is clicked
*/
function btn_submit_OnClick(event) {
    
    // Get the selection from the list of cuisines
    getCuisineSelection();

    // Get the selection from the list of meal types
    getMealTypeSelection();

    // Get the selection from the list of price range
    getPriceRangeSelection();

    // Validate selection before loading the second page
    // Note that we don't validate price range because people may not select anything
    if( validateCuisineSelection() && validateMealSelection() )
    {
        //Don't reload current page
        event.preventDefault();

        // Set local storage for the result page
        localStorage.setItem("_locationInput", _locationInput);
        localStorage.setItem("_selectedCuisine", _selectedCuisine);
        localStorage.setItem("_selectedMealType", _selectedMealType);
        localStorage.setItem("_selectedPriceRange", _selectedPriceRange);

        window.location.replace("Results.html");
    }
    else
    {
        event.preventDefault();
    }
}

/*
    Validate cuisine selection, only allow at most two cuisines
*/
function validateCuisineSelection() {

    // Too many cuisines
    if( _selectedCuisine.length > 2 )
    {
        alert("You can't select more than two cuisines!");
        return false;
    }

    var selected = null;

    // Loop through selection and store the selected values in comma separated global variable
    // Will be used as a parameter in the second page
    for (var i = 0; i < _selectedCuisine.length; i++) {

        if( selected == null )
        {
            selected = _selectedCuisine[i];
        }
        else
        {
            selected += "," + _selectedCuisine[i];
        }

    }

    return true;
}

/*
    Validate meal type selection, must select at least one
*/
function validateMealSelection() {

    if( _selectedMealType == null )
    {
        alert("You must select at least one meal type!");
        return false;
    }

    return true;
}


/*
    Loop through the list of cuisines on the page and if it's checked, add to the global variable array
*/
function getCuisineSelection() {

    _selectedCuisine = [];

    var cuisineElements = document.getElementById("cuisine_form").elements;

    if( cuisineElements != null )
    {
        for( var i = 0; i< cuisineElements.length; i++ )
        {
            if( cuisineElements[i].type == "checkbox")
            {
                if( cuisineElements[i].checked == true )
                {
                    _selectedCuisine.push(cuisineElements[i].value);
                }
            }
        }
    }
}

/*
    Loop through the list of meal types on the page and store the value of the one that is checked
*/
function getMealTypeSelection() {

    var mealType = document.getElementsByName("radioMealType");

    for(var i = 0; i < mealType.length; i++)
    {
        if( mealType[i].checked)
        {
            _selectedMealType = mealType[i].value;
            break; // we already found what's selected, quit the loop
        }
    }
}

/*
    Loop through the list of price ranges on the page and store the value of the one that is checked
*/
function getPriceRangeSelection() {

    var priceRange = document.getElementsByName("radioPrice");

    for(var i = 0; i < priceRange.length; i++)
    {
        if( priceRange[i].checked)
        {
            _selectedPriceRange = priceRange[i].value;
            break; // we already found what's selected, quit the loop
        }
    }
}
