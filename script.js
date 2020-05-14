
var city=""; 
var url="";
var APIkey="";
var queryurl ="";
var currenturl = "";
var citiesDiv = document.getElementById("searched_cities_container");
//empty array
var cities = []; 
init(); 
listClicker(); 
searchClicker(); 


//runs a weatherData forecast and fiveDays
function APIcalls(){
    
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currenturl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=5ce8439fd4264478d1da0b24a7cd547d";
    queryurl = url + city + APIkey;
    current_weather_url = currenturl + city + APIkey;  
    $.ajax({
        url:current_weather_url,
        method: "GET", 
    }).then(function(current_data){
        console.log(current_data);
        var temp = Math.round(((current_data.main.temp - 273.15) * 9/5 + 32))
        console.log("The temperature in " + city + " is: " + temp);
        $("#today_temp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
        $("#today_humidity").text("Humidity: " + current_data.main.humidity);
        $("#today_wind_speed").text("Wind Speed: " + current_data.wind.speed);
        $("#today_icon_div").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
         "height": "100px", "width":"100px"});
    })
    
    $("#name_of_city").text("" + city);
    $.ajax({
        url: queryurl,
        method: "GET",
        
    }).then(function(response){
        var day_number = 0; 
        for(var i=0; i< response.list.length; i++){
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
            var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
            var month = response.list[i].dt_txt.split("-")[1];
            var year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(month + "/" + day + "/" + year); 
            var temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + day_number + "five_day_temp").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + day_number + "five_day_humidity").text("Humidity: " + response.list[i].main.humidity);
                $("#" + day_number + "five_day_icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                console.log(response.list[i].dt_txt.split("-"));
                console.log(day_number);
                console.log(response.list[i].main.temp);
                day_number++; 
                        }   
        }
    });   
    
}
//pull saved cities from local storage 
function init(){
    var saved_cities = JSON.parse(localStorage.getItem("cities"));

    if (saved_cities !== null){
        cities = saved_cities
      }  
    renderButtons(); 
    localStorage.setItem("cities", JSON.stringify(cities));
}

function renderButtons(){
    citiesDiv.innerHTML = ""; 
    if(cities == null){
        return;
    }
    var unique_cities = [...new Set(cities)];
    for(var i=0; i < unique_cities.length; i++){
        var cityName = unique_cities[i]; 
        var buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("class", "listbtn"); 

        citiesDiv.appendChild(buttonEl);
        listClicker();
      }
    }
//search history button
function listClicker(){
$(".listbtn").on("click", function(event){
    event.preventDefault();    
    city = $(this).text().trim();
    APIcalls(); 
})
}
//click search bar
function searchClicker() {
$("#searchbtn").on("click", function(event){
    event.preventDefault();
    cities.push(city);
    city = $(this).prev().val().trim()  

    if(cities.length >= 8){
        cities.shift()
    }
    if (city == ""){
        return; 
    }
    APIcalls();
    storeCities(); 
    renderButtons();
})
}






