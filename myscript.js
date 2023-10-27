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

    //Hide the next button
    x = document.getElementById("btn_submitlocation");
    x.style.display = "none";
}

function validateCuisineSelection() {

    var checkboxes = document.getElementsByName("chkCuisine");
    var numberOfCheckedItems = 0;

    for (var i = 0; i < checkboxes.length; i++) {

        if (checkboxes[i].checked)
            numberOfCheckedItems++;

    }

    if (numberOfCheckedItems > 3) {
        alert("You can't select more than three cuisines!");
        return false;
    }  

}