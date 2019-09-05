async function getRoute(id){
  let route = []
  await $.ajax({
      url: `https://campus-shuttle.herokuapp.com/route/direction/${id}`, 
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
      zoom:15,
      center: {lat: 33.498070, lng: -80.854220},
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    });
    let userLocation;
    var currpos = [];
    let centered = false;
    setInterval(() => {
      if(userLocation)
        userLocation.setMap(null)

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(response => {
        currpos = response;
        },(e) => console.log(e), {enableHighAccuracy: true});
      }
      
      if (currpos.coords){
        userLocation = new google.maps.Marker({
          position: new google.maps.LatLng(currpos.coords.latitude, currpos.coords.longitude),
          map: map,
          icon: './you.png',
          title: 'your current position'
        });
        if(!centered){
          map.setCenter({lat: currpos.coords.latitude, lng: currpos.coords.longitude});
          centered = true;
        }
        userLocation.setMap(map);
      }
    }, 2000);
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
} 


function getRouteInfo(){
  $.get("https://campus-shuttle.herokuapp.com/route/getroutes/").then(data => {
    console.log(data);
    data.forEach(route => {
      $('ul').append(`<li class = "route_name"><a href="${route.id}">${route.route_name}</a></li>`)
    });
    // On click render route on map
    $(".route_name a").click(e => {
      e.preventDefault();
      let id = $(e.target).attr('href');
          
      // Render route and show buses moving
      getRoute(id).then(routeInfo => {
        var flightPath = new google.maps.Polyline({
          path: routeInfo,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });
        flightPath.setMap(map);
        
        // Get buses on route
        let buses;
        data.forEach(datum => {
          if(datum.id == id){
            buses = datum.buses;
          }
        });
        console.log(buses)
        buses.forEach( id => {
          let marker;
          setInterval(() => {  
            // Get position of vehicle being tracked
            $.get(`https://campus-shuttle.herokuapp.com/shuttle/${id}/`).then(response => {
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

getRouteInfo();