(function() {
  window.session = {
    options: {
      gapi_locations: true
    },
    start: function(session) {
      return jQuery(function() {
        var map_i_am;
        map_i_am = new MapIAm('map-canvas', 'country-name', {
          'me': {
            lat: session.location.latitude,
            lng: session.location.longitude,
            country_code: session.location.address.country_code,
            region: session.location.address.region
          }
        });
        return map_i_am.update();
      });
    }
  };
}).call(this);
