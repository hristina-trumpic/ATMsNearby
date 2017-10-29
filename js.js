var map;
var infowindow;
var pin_info;
var atm_list;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 44.8151597, lng: 20.2825119},
    zoom: 12
  });
  infoWindow = new google.maps.InfoWindow;
  atm_list = new google.maps.InfoWindow;

  // HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
	  atm_list.open(map);
      map.setCenter(pos);
      // ATM marker creator
      var service = new google.maps.places.PlacesService(map);
      var request = {
               location: pos,
               rankBy: google.maps.places.RankBy.DISTANCE,
               keyword: ['теленор' || 'telenor'],
               types: ['atm']
               };
      service = new google.maps.places.PlacesService(map);
      service.search(request, callback);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function callback(results, status) {
  var atm_list_data = "<br> <br>";
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; (i < 10 && i < results.length); i++) {
      createMarker(results[i]);
	  atm_list_data = atm_list_data + (i+1) + "." + results[i].name + ":"  + "<br>";
	  if (results[i].formatted_address != undefined) {
	     atm_list_data = atm_list_data + "<i>" + results[i].formatted_address + "</i>" + "<br>";
	  }
	  else {atm_list_data = atm_list_data + "<i>Adresa nije dostupna</i>" + "<br>";}
    }
	atm_list.setContent(atm_list_data);

  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    var place_data = "";
	place_data = place.name + "<br>";
	if (place.formatted_address != undefined) {
	   place_data = place_data + place.formatted_address;
	}
	else {place_data = place_data + "Adresa nije dostupna" + "<br>";}
	pin_info = new google.maps.InfoWindow;
	pin_info.setContent(place_data);
    pin_info.open(map, this);
  });
}
