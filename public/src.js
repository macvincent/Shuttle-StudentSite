// Get JSON of route co-ordinates
async function getRoute(id){
  let route = []
  await $.ajax({
      url: `http://127.0.0.1:8000/route/direction/${id}`, 
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

function getRouteInfo(){
  $.get("http://127.0.0.1:8000/route/getroutes/").then(data => {
    console.log(data);
    //Append the list of routes to sidebar
    data.forEach(route => {
      $('ul').append(`<li class = "route_name"><a href="${route.id}">${route.route_name}</a></li>`)
    });
      // When clicked, render route on map and show position of the bus moving
      $(".route_name a").click(e => {
      e.preventDefault();
      let id = $(e.target).attr('href');

      getRoute(id).then(routeInfo => {
        var flightPath = new google.maps.Polyline({
          path: routeInfo,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });
        flightPath.setMap(map);
        
        // Get list of buses on route
        let buses;
        data.forEach(datum => {
          if(datum.id == id){
            buses = datum.buses;
          }
        });
        console.log(buses)
        // Track position of each bus every one second
        buses.forEach( id => {
          let marker;
          setInterval(() => {
            // Get position of vehicle being tracked
            $.get(`http://127.0.0.1:8000/shuttle/${id}/`).then(response => {
              if(marker)
                marker.setMap(null)
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(response[0].latitude, response[0].longitude),
                map: map,
                icon: './car.png',
                title:"Hello World!"
              });
              marker.setMap(map);
            });

          }, 1000);
        })
      }).catch(error => {
        alert("sorry we have an error");
      });
    });    
  });
}

// getRouteInfo();

let setUpNav = () => {
  $('#button').click(e => {
    e.preventDefault();
    $('nav').toggleClass('active');
    $('.route_name , #map').click(e => {
      if($('nav').attr('class') == 'active'){
        e.preventDefault();
        $('nav').toggleClass('active');
      }
    })
  });
};

$(document).ready(function() {
  setUpNav();
});