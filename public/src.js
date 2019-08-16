async function getRoute(){
  let route = []
  await $.ajax({
      url: "http://127.0.0.1:8000/route/direction/7", 
      type: "GET",   
      dataType: 'json',
      cache: true,
      success: function(data){
        route = JSON.parse(data);
      },
      error: function(data){
        console.log("Error: ", data);
      }           
  });
  return route;
}
var map;
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: 34.682, lng: -82.782},
      mapTypeId: 'terrain'
    });
    let userLocation;
    var currpos = [];
    setInterval(() => {
      if(userLocation)
        userLocation.setMap(null)

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(response => {
        currpos = response;
        });
      }
      
      if (currpos.coords){
        userLocation = new google.maps.Marker({
          position: new google.maps.LatLng(currpos.coords.latitude, currpos.coords.longitude),
          map: map,
          title: 'your current position'
        });
        userLocation.setMap(map);
      }
    }, 2000);
} 

// Render route
getRoute().then(flightPlanCoordinates => {
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);
  let marker;

  setInterval(() => {
    // Set position of user

    // // Get position of vehicle being tracked
    // $.get('http://127.0.0.1:8000/shuttle/4/').then(response => {
    //   if(marker)
    //     marker.setMap(null)
    //   console.log("got here", response[0].longitude, response[0].latitude);
    //   marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(response[0].latitude, response[0].longitude),
    //     map: map,
    //     icon: './car.png',
    //     title:"Hello World!"
    //   });
    //   marker.setMap(map);
    // });

  }, 1000);

}).catch(error => {
  alert("sorry we have an error");
});

function getRouteInfo(){
  $.get("http://127.0.0.1:8000/route/getroutes/").then(data => {
    data.forEach(route => {
      $('ul').append(`<li class = "route_name"><a href="#">${route.route_name}</a></li>`)
    });
  });
}

getRouteInfo();