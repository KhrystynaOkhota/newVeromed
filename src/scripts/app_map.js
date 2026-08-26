
/*jQuery(function ($) {

  function initializeMap() {
    var element = document.getElementById('map');
    var options = {
      zoom: 15,
      center: { lat: 50.47253296158417, lng: 30.443476447314264 },
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            { "color": "#F4F4F4" }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            { "color": "#F4F4F4" }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            { "color": "#dddee2" }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            { "color": "#ccd4db" }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            { "color": "#ccd4db" }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#616161" }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            { "color": "#cad2d8" }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#757575" }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#616161" }
          ]
        }
      ]
    };
    var myMap = new google.maps.Map(element, options);
    var markers = [{
      coordinates: { lat: 50.47253296158417, lng: 30.443476447314264 },
      image: "assets/img/pin.png",
      info: "<div class='map-info'><h4>test</h4><div>test</div><a href='tel:354678'>346577ijhgfv</a></div>"
    },];

    function addMarker(properties) {
      var marker = new google.maps.Marker({ position: properties.coordinates, map: myMap, icon: properties.image });
      if (properties.image) {
        marker.setIcon(properties.image);
      }
      if (properties.info) {
        marker.addListener('click', function () {
          InfoWindow.open(myMap, marker);
        });
        var InfoWindow = new google.maps.InfoWindow({ content: properties.info });
      }
    }

    for (var i = 0; i < markers.length; i++) {
      addMarker(markers[i]);
    }
  }
  initializeMap();
});
*/
	jQuery(function ($) {

	  function initializeMap() {
		var element = document.getElementById('map');
		if (!element) return; 

		var options = {
		  zoom: 15,
		  center: { lat: 50.47253296158417, lng: 30.443476447314264 },
      gestureHandling: 'greedy',
		  styles: [
			{ "elementType": "geometry", "stylers": [ { "color": "#F4F4F4" } ] },
			{ "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#F4F4F4" } ] },
			{ "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#dddee2" } ] },
			{ "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ccd4db" } ] },
			{ "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#ccd4db" } ] },
			{ "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] },
			{ "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#cad2d8" } ] },
			{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] },
			{ "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }
		  ]
		};

		var myMap = new google.maps.Map(element, options);
		
		var markers = [{
		  coordinates: { lat: 50.47253296158417, lng: 30.443476447314264 },
		  image: "assets/img/pin.png",
		  info: "<div class='map-info'><h4>test</h4><div>test</div><a href='tel:354678'>346577ijhgfv</a></div>"
		}];

		function addMarker(properties) {
		  var marker = new google.maps.Marker({ 
			position: properties.coordinates, 
			map: myMap, 
			icon: properties.image || null 
		  });

		  if (properties.info) {
			var infoWindow = new google.maps.InfoWindow({ content: properties.info });
			marker.addListener('click', function () {
			  infoWindow.open(myMap, marker);
			});
		  }
		}

		for (var i = 0; i < markers.length; i++) {
		  addMarker(markers[i]);
		}
	  }

	  function infoGoogleMapsReady() {
		return new Promise(function (resolve) {
		  // Блок без використання знаків "&&"
		  if (typeof google !== 'undefined') {
			if (typeof google.maps !== 'undefined') {
			  resolve();
			  return;
			}
		  }

		  var script = document.querySelector('script[src*="maps.googleapis.com"]');
		  
		  if (script) {
			script.addEventListener('load', resolve);
			script.addEventListener('error', function() {
			  console.error("Не вдалося завантажити файл Google Maps API.");
			});
		  } else {
			console.error("Тег скрипта Google Maps не знайдено на сторінці.");
		  }
		});
	  }

	  infoGoogleMapsReady().then(initializeMap);

	});
