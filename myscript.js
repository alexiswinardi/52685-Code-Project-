
var _locationInput = null;
var _selectedCuisine = [];

function formLoad() {

    //Put stuff here that should happen when the page is loaded
    //eg: Load the data, initialise variables etc

}

function btn_submitLocation_OnClick() {

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

function btn_submitCuisine_OnClick(event) {
    
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

        if( validateCuisineSelection() )
        {
            // Do next step
        }
        else
        {
            event.preventDefault();
        }
    }

}

function validateCuisineSelection() {

    if( _selectedCuisine.length > 2 )
    {
        alert("You can't select more than two cuisines!");
        return false;
    }

    var selected = null;

    for (var i = 0; i < _selectedCuisine.length; i++) {

        if( selected == null )
        {
            selected = _selectedCuisine[i];
        }
        else
        {
            selected += ", " + _selectedCuisine[i];
        }

    }

    alert (selected);

    return true;
}