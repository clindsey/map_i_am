(function() {
  window.session = {
    options: {
      gapi_locations: true
    },
    start: function(session) {
      return jQuery(function() {
        map_i_am.add_marker('user_0', session.location.latitude, session.location.longitude);
        return map_i_am.update();
      });
    }
  };
}).call(this);
