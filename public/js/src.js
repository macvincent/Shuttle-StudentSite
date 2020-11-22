let currPos = [];
let closestBusStop = [];
let eta = [];
let currentETASecond = Number.MAX_VALUE;
let simulate = false;

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

let getClosestActiveBusStop = () => {
  if(!currPos.coords.latitude)return;
  let currPosition = new google.maps.LatLng(currPos.coords.latitude, currPos.coords.longitude);
  let distanceMatrix = new google.maps.DistanceMatrixService();
  let currentClosestDistance = Number.MAX_VALUE;
  busStops.forEach(busStop => {
    if(busStop.active){
      distanceMatrix.getDistanceMatrix({
        origins: [currPosition],
        destinations: [{lat: busStop.location[0], lng: busStop.location[1]}],
        travelMode: "WALKING",
      }, (response, status) => {
        let tempDuration = response.rows[0].elements[0].duration;
        if(tempDuration.value < currentClosestDistance){
          currentClosestDistance = tempDuration.value;
          closestBusStop = {name: busStop.name, duration: tempDuration.text};
        }
      });
    }
  });
  return closestBusStop;
}

// find closest bus to stop
let getETA = (busStopId) => {
  let stopPosition = {lat: busStops[busStopId].location[0], lng: busStops[busStopId].location[1]}
  let distanceMatrix = new google.maps.DistanceMatrixService();
  currentETASecond = Number.MAX_VALUE;

  buses.forEach((bus, id) => {
    if(bus.route.includes(parseInt(busStopId))){
      distanceMatrix.getDistanceMatrix({
        origins: [bus.location],
        destinations: [stopPosition],
        travelMode: "DRIVING",
      }, (response, status) => {
        let tempResponse = response.rows[0].elements[0].duration;
        if(tempResponse.value < currentETASecond){
          currentETASecond = tempResponse.value;
          eta = tempResponse.text;
        }
      });
    }
  });
};

let getInfo = () => {
  $("#getInfo").click(() => {
    let interval = setInterval(()=> {
      if(!simulate)clearInterval(interval);
      let destinationStop = $("#busStops :selected").val();
      getClosestActiveBusStop();
      getETA(destinationStop);
      let appendStr = `            
        <span> Nearest Bus Stop: </br> ${closestBusStop.name || ''} (${closestBusStop.duration || ''} walk) </span></br></br>
        <span> Bus ETA at Stop: </br> ${eta || ''} </span></br></br>
        <span> Selected Destination: </br> ${busStops[destinationStop].name || ''} </span></br>`;
      if(simulate)$(".response").html(appendStr);
    }, 2000);
  });
};

$(document).ready(function() {
  setUpNav();
  getInfo();
  $('input[name=simulate]').change(function(){
    if($(this).is(':checked')) {
      console.log("Start Simulation");
      simulate = true;
      simulateDriverPaths(busStops);            

    } else {
      console.log("End Simulation");
      simulate = false;
      $(".response").html('');
      initMap(map);
    }
  });
});