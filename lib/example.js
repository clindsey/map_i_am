(function() {
  window.session = {
    options: {
      gapi_locations: true
    },
    start: function(session) {
      return jQuery(function() {
        var map_i_am, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
        return map_i_am = new MapIAm('map-canvas', 'country-name', {
          'Jacob': {
            lat: (session != null ? (_ref = session.location) != null ? _ref.latitude : void 0 : void 0) != null ? session.location.latitude : -26.057053,
            lng: (session != null ? (_ref2 = session.location) != null ? _ref2.longitude : void 0 : void 0) != null ? session.location.longitude : 145.305433,
            country_code: (session != null ? (_ref3 = session.location) != null ? (_ref4 = _ref3.address) != null ? _ref4.country_code : void 0 : void 0 : void 0) != null ? session.location.address.country_code : 'AU',
            region: (session != null ? (_ref5 = session.location) != null ? (_ref6 = _ref5.address) != null ? _ref6.region : void 0 : void 0 : void 0) != null ? session.location.address.region : ''
          },
          'Samuel': {
            lat: 41.047428,
            lng: 28.858663,
            country_code: 'TR',
            region: ''
          },
          'Charles': {
            lat: 35.046,
            lng: -85.31,
            country_code: 'US',
            region: 'TN'
          },
          'Benjamin': {
            lat: -1.103732,
            lng: -80.169145,
            country_code: 'EC',
            region: ''
          }
        });
      });
    }
  };
}).call(this);
