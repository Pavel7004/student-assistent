document.addEventListener("DOMContentLoaded", function() {
  function myFunction() {
    var dropdown = document.getElementById("myDropdown");
    if (dropdown.style.display === "none") {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
  }
  
  document.getElementById("menu").addEventListener("click", myFunction);
});
