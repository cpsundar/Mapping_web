function createMap(eqplaces) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "EarthQuake Places": eqplaces
  };

  // Create the map object with options
  var map = L.map("map-id", {
   // center: [40.73, -74.0059],
   center: [0, 0],
    zoom: 2,
    layers: [lightmap, eqplaces]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

}




function get_color(mag) {

      //console.log(`color:${mag}`)
      if ( mag <= 1 ) {return "skyblue"}
      else if (mag > 1 && mag <= 2) {return "green"}
      else if (mag > 2 && mag <= 3) {return "yellow"}
      else if (mag > 3 && mag <= 4) {return "blue"}
      else if (mag > 4 && mag <= 5) {return "orange"}
      else if (mag > 5 ) {return "red"}
      return "pink"
}

function get_radius(mag) {
  basesize=5000;
  if ( mag <= 1 ) {return basesize * 10}
  else if (mag > 1 && mag <= 2) {return basesize * 20}
  else if (mag > 2 && mag <= 3) {return basesize * 30}
  else if (mag > 3 && mag <= 4) {return basesize * 40}
  else if (mag > 4 && mag <= 5) {return basesize * 50}
  else if (mag > 5) {return basesize * 100}
  return basesize * 120
  // return 5
}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var earthQuake_places = response.features;
  console.log(earthQuake_places.length);
  console.log(response.features[2].geometry.coordinates[1]);
  console.log(response.features[2].properties.mag);

  // Initialize an array to hold bike markers
  var eqMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < earthQuake_places.length; index++) {
    var eqplace = earthQuake_places[index];

    //console.log(`${eqplace.geometry.coordinates[0]}, ${eqplace.geometry.coordinates[1]}`) 

    // For each station, create a marker and bind a popup with the station's name
    var eqMarker = L.circle([eqplace.geometry.coordinates[1], eqplace.geometry.coordinates[0]], {
      color: get_color(eqplace.properties.mag),
      //fillColor: "green",
      fillOpacity: 0.75,
      radius: get_radius(eqplace.properties.mag)
    })
      .bindPopup("<h3>Magnitude:" + eqplace.properties.mag + "<h3> <h3>Place:" + eqplace.properties.place + 
       "<h3>  <h3>Depth: " + eqplace.geometry.coordinates[2] + " Km <h3>");

    // Add the marker to the bikeMarkers array
    eqMarkers.push(eqMarker);
  }



  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(eqMarkers));


  var ranges = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  var sample_ranges = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < ranges.length; i++) {

        // document.querySelector(".legend").innerHTML +=
        // '<p class= squre "' + get_color(sample_ranges[i])+ '"> '+ ranges[i]+ '</P> ' 

      var space = "  "        ;
        document.querySelector(".legend").innerHTML +=
        '<span class="' + get_color(sample_ranges[i])+ '">  __  </span> ' + '<span class="padded">' + ranges[i] + '</span> <br>'

      }
 
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);
