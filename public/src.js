let map;

async function getData(){
  let polyline_data = []
  let temp = []
  let url = "https://maps.googleapis.com/maps/api/directions/json?origin=34.682,-82.782&destination=35.227,-80.843&key=AIzaSyAgII8bDagXqXHG1te_iD-sS34vvamF4Dg";
  await $.ajax({
      url: "http://127.0.0.1:8000/direction?url="+url, 
      type: "GET",   
      dataType: 'json',
      cache: false,
      success: function(data){
          data = data.routes[0].legs[0].steps;
          data.forEach((entry) => {
            temp.push(entry.start_location);
          });
          for (let i = 1; i < temp.length; i++){
            let a = temp[i-1];
            let b = temp[i];
            //swap to a is always less than b
            if(a.lat > b.lat){
              let t = a;
              a = b;
              b = a;
            }
            //Make use of equation of a line to populate data set
            let m = (b.lat - a.lat)/(b.lng - a.lng);
            let c = a.lng - (m*a.lat);
            let intv = 0.005;
            while(a.lat < b.lat){
              polyline_data.push({lat: a.lat, lng: (m*a.lat) + c});
              a.lat += intv;
            }
          }
      },
      error: function(data){
        console.log("Error: ", data)
      }           
  });
  console.log(polyline_data)
  return polyline_data;
}
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 34.682, lng: -82.782},
        mapTypeId: 'terrain'
      });
      getData().then(flightPlanCoordinates => {
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        flightPath.setMap(map);

        let i = 0;
        var marker;  
        var count=flightPlanCoordinates.length;
        var interval=setInterval(function() {
          var pos=flightPlanCoordinates[i]
          if(marker)
            marker.setMap(null)
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.lat,pos.lng),
            map: map,
            icon: './car.png',
            title:"Hello World!"
          });
          marker.setMap(map);
          i++
          if(i==count)
            window.clearInterval(interval)
        }, 500);

      }).catch(error => {
        alert("sorry we have an error");
      });
}