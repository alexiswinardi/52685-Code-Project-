function formLoad() {

    //Get all the items from localStorage created by the GetStarted page

    document.getElementById("location").innerText = localStorage.getItem("_locationInput");
    document.getElementById("cuisines").innerText = localStorage.getItem("_selectedCuisine");
    document.getElementById("meal").innerText = localStorage.getItem("_selectedMealType");
    document.getElementById("price").innerText = localStorage.getItem("_selectedPriceRange");

    //Load data from spreadsheet

}