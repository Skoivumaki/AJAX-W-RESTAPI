var search = "";
var url = "";
const form = document.querySelector('.js-form');

// Initiate new search on submit
form.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('.js-todo-input');

  // Get date and create new url
  const date = new Date();
  console.log(date);
  var vuosi;
  var kuukaus;
  var paiva;
  vuosi = date.getFullYear();
  paiva = date.getDate();
  kuukaus = date.getMonth()+1;
  console.log("asdfasd"+kuukaus);
  const text = input.value.trim();
  search = "https://rata.digitraffic.fi/api/v1/routesets/station/"+text+"/"+vuosi+"-"+"0"+kuukaus+"-"+paiva;

  // Store search result in local and refresh
  sessionStorage.setItem("searchlocal",search);
  console.log(vuosi+"-"+kuukaus+"-"+paiva);
  location.reload();
});

// Function to set requested station to search
function urlcompare(){
  let search = sessionStorage.getItem("searchlocal")
  console.log(search);
  if (search == null) {
    url = 'https://rata.digitraffic.fi/api/v1/routesets/station/KR/2023-04-21';
  } else {
    url = search;
    console.log("else "+url);
  }
}

// Table creation
document.addEventListener("DOMContentLoaded", () =>{
  const form = document.getElementsByClassName('js-form')[0];
  // Load list
  urlcompare();
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var jsonData = JSON.parse(this.responseText);

    // Get the container element where the table will be inserted
    let container = document.getElementById("id01");
    
    // Create the table element
    let table = document.createElement("table");
    table.classList.add("table");
    table.setAttribute("id","table");
    table.classList.add("table-striped");

    //Modify jsonData
    jsonData.forEach(function(x){ delete x.version });
    jsonData.forEach(function(x){ delete x.message });
    jsonData.forEach(function(x){ delete x.clientSystem });
    jsonData.forEach(function(x){ delete x.messageId });
    //jsonData.forEach(function(x){ delete x.routesections });
    //console.log("testi "+JSON.stringify(jsonData[0].routesections[0]));
    // Get the keys (column names) of the first object in the JSON data
    let cols = Object.keys(jsonData[0]);
    //console.log("Uus "+jsonData);
    //console.log(cols);
    //console.log(jsonData[0].version + jsonData[0].messageTime);
    
    // Create the header element
    let thead = document.createElement("thead");
    thead.classList.add("thead-dark");
    let tr = document.createElement("tr");
    // Loop through the column names and create header cells
    cols.forEach((item) => {
      let th = document.createElement("th");
      th.classList.add("col");
      switch (item) {
        case "messageTime":
          item = "Lähtöaika"
          break;
        case "trainNumber":
          item = "Juna"
          break;
        case "departureDate":
          item = "Päivä"
          break;
        case "routeType":
          item = "Reitti"
          break;
        case "routesections":
          item = "Pysähdykset"
          break;
      }
      th.innerText = item; // Set the column name as the text of the header cell
      tr.appendChild(th); // Append the header cell to the header row
    });
    thead.appendChild(tr); // Append the header row to the header
    table.append(tr) // Append the header to the table
    
    // Loop through the JSON data and create table rows
    jsonData.forEach((item) => {
      let tr = document.createElement("tr");
      
      // Get the values of the current object in the JSON data
      let vals = Object.values(item);
      
      // Loop through the values and create table cells
      vals.forEach((elem) => {
        let td = document.createElement("td");
        console.log("elem "+elem);
        let compare = JSON.stringify(elem);
        //console.log("compare "+compare)
        let result = compare.includes("Z");
        if (result === true){
          var newelem;
          console.log("was true "+search);
          newelem = elem.slice(11,16);
          console.log(newelem);
          elem = newelem;
          

          //console.log("elemlist"+elemlist);
          //elemlist.forEach((list) => {
          //	list = list.toString();
          //	newelem=newelem+" "+list;
          //});
          //elem=newelem;

          //console.log(elem);
        }
        td.innerText = elem; // Set the value as the text of the table cell
        tr.appendChild(td); // Append the table cell to the table row
      });
      table.appendChild(tr); // Append the table row to the table
    });
    container.appendChild(table) // Append the table to the container element
    Wait();

    // Function to remove please wait... text when page loaded
    function Wait() {
      var el_down = document.getElementById("test");
      el_down.innerHTML = "";
    }
    }
  }
  xhr.send();
  

});
