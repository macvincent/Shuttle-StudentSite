let map;

async function getRoute(){
  let route = []
  let populatedRoute = []
  let url = "https://maps.googleapis.com/maps/api/directions/json?origin=34.682,-82.782&destination=35.227,-80.843&key=AIzaSyAgII8bDagXqXHG1te_iD-sS34vvamF4Dg";
  await $.ajax({
      url: "http://127.0.0.1:8000/direction?url="+url, 
      type: "GET",   
      dataType: 'json',
      cache: true,
      success: function(data){
          data = data.routes[0].legs[0].steps;
          data.forEach((entry) => {
            route.push(entry.start_location);
          });
          for (let i = 1; i < route.length; i++){
            let a = route[i-1];
            let b = route[i];
            //swap to a is always less than b
            if(a.lat > b.lat){
              let t = a;
              a = b;
              b = a;
            }
            //Make use of equation of a line to populate data set
            let m = (b.lat - a.lat)/(b.lng - a.lng);
            let c = a.lng - (m*a.lat);
            let intv = 0.01;
            while(a.lat < b.lat || a.lng < b.lng){
              populatedRoute.push({lat: a.lat, lng: (m*a.lat) + c});
              if(a.lat < b.lat){
                a.lat += intv;
              }else{
                a.lng += 0.1;
              }
            }
          }
      },
      error: function(data){
        console.log("Error: ", data);
      }           
  });
  return populatedRoute;
}
function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: 34.94957, lng: -81.93205},
      mapTypeId: 'terrain'
    });
    getRoute().then(route => {
      // Draw polyline
      var flightPath = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      flightPath.setMap(map);
      //Set markers
      let marker;
      let userLocation;
      var currpos = [];
      setInterval(() => {
        // Set position of user
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

        // Get position of vehicle being tracked
        $.get('http://127.0.0.1:8000/shuttle/4/').then(response => {
          if(marker)
            marker.setMap(null)
          console.log("got here", response[0].longitude, response[0].latitude);
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(response[0].latitude, response[0].longitude),
            map: map,
            icon: './car.png',
            title:"Hello World!"
          });
          marker.setMap(map);
        });

      }, 1000);

    }).catch(error => {
      alert("sorry we have an error");
    });
}