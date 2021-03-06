let busStopIcon = './img/busStop.svg';
let userLocation = null;
let centered = false;
let busStops = [
    {
        name: "Campus",
        location: [33.4991,-80.8534],
        active: false,
    },
    {
        name: "Walmart",
        location: [33.524309, -80.893383],
        active: false,
    },
    {
        name: "740 Avenue Apartment",
        location: [33.503165, -80.85767],
        active: false,
    },
    {
        name: "Edisto Gardens",
        location: [33.487697, -80.874106],
        active: false,
    },
    {
        name: "Dollar General",
        location: [33.484995,-80.870719],
        active: false,
    }
];

let buses = [
  {
    name: "bus1",
    route: [0, 1, 2],
    location: [],
  },
  {
    name: "bus2",
    route: [3, 2, 0],
    location: [],
  }
]

//  We create and specify the design of the map element that will be displayed to the user
let map;
let markerPath;
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
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8ec3b9"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1a3646"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#64779e"
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#334e87"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6f9ba5"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3C7680"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#304a7d"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2c6675"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#255763"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#b0d5ce"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3a4762"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#0e1626"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#4e6d70"
              }
            ]
          }
        ]
    });

    updateUserLocation(map);
    addBusStops(map);
    updateActiveBusStops();
    console.log("Initialized Map");
}

// Add busstops
let addBusStops = (map) => {
    busStops.forEach(busStop => {
        let iconLink = busStop.active ? './img/busStop.svg' : './img/inActiveBusStop.svg';
        new google.maps.Marker({
            position: new google.maps.LatLng(busStop.location[0],busStop.location[1]),
            title:busStop.name,
            icon: iconLink,
            map: map,
        });
    });
};

// Update Current User Position
let updateUserLocation = (map) => {
    setInterval(() => {
        // Destoy marker after each interval
        if(userLocation)
            userLocation.setMap(null)

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(response => {
            currPos = response;
            },(e) => console.log(e), {enableHighAccuracy: true});
        }

        let markerPath = `./img/locationMarker.svg`;
        if (currPos.coords){
            userLocation = new google.maps.Marker({
                position: new google.maps.LatLng(currPos.coords.latitude, currPos.coords.longitude),
                map: map,
                icon : markerPath,
                title: 'Your Current Position'
            });
            if(!centered){
                map.setCenter({lat: currPos.coords.latitude, lng: currPos.coords.longitude});
                centered = true;
            }
            userLocation.setMap(map);
        }
    }, 2000);
};

let simulateDriverPaths = (busStops) =>{
    if(userLocation)userLocation.setMap(map);
    buses.forEach((bus, id) => {
      let route = bus.route;
      route.forEach(stop => {
        busStops[stop].active = true;
      });
      let origin = {lat: busStops[route[0]].location[0], lng: busStops[route[0]].location[1]};
      let destination = {lat: busStops[route[1]].location[0], lng: busStops[route[1]].location[1]};
      let waypoint =  {lat: busStops[route[2]].location[0], lng: busStops[route[2]].location[1]};
      let travelMode = "DRIVING";
      let directionsService = new google.maps.DirectionsService;
      directionsService.route(
          {
              destination: destination,
              origin: origin,
              travelMode: travelMode,
              waypoints: [{location: waypoint}],
          },
          (result, status) => {
              let directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
              directionsRenderer.setDirections(result);
              directionsRenderer.setMap(map);
              directionsRenderer.setOptions({
                  markerOptions: {
                      map: null,
                  }
              });

              let route = result.routes[0].overview_path;
              simulateRoute(route, id);
          }
      );
    });
    initMap();
};

let simulateRoute = (route, id) => {
  let interval = 1000;
  let userLocation = new google.maps.Marker({
    map: map,
    icon : './img/bus.svg',
    title: 'bus'
  });;
  reversedRoute = Object.assign([], route);
  reversedRoute.reverse();

  route.forEach((point, index) => {
    let to1 = setTimeout(()=>{
      if(!simulate)clearTimeout(to1);
      userLocation.setPosition(point);
      buses[id].location = point;
    }, interval*index);
  });
  reversedRoute.forEach((point, index) => {
    let to2 = setTimeout(()=>{
      if(!simulate)clearTimeout(to2);
      userLocation.setPosition(point);
      buses[id].location = point;
    }, (interval*reversedRoute.length) + interval*index);
  });
  let to3 = setTimeout(() => {
    if(!simulate)clearTimeout(to3);
    userLocation.setMap(null);
    simulateRoute(route, id);
  }, (interval*reversedRoute.length*2));
}

let updateActiveBusStops = () => {
  busStops.forEach((busStop, index) => {
    if(busStop.active)
      $("select").append(`<option value="${index}">${busStop.name}</option>`);
  });
};