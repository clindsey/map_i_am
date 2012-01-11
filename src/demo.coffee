window.session =
  options:
    gapi_locations: true
  start: (session) ->
    jQuery () -> # barf
      map_i_am = new MapIAm 'map-canvas', 'country-name', {
          'Me':
            lat: session.location.latitude
            lng: session.location.longitude
            country_code: session.location.address.country_code
            region: session.location.address.region
          'Jacob':
            lat: -26.057053
            lng: 145.305433
            country_code: 'AU'
            region: ''
          'Samuel':
            lat: 41.047428
            lng: 28.858663
            country_code: 'TR'
            region: ''
          'Charles':
            lat: 35.046
            lng: -85.31
            country_code: 'US'
            region: 'TN'
          'Benjamin':
            lat: -1.103732
            lng: -80.169145
            country_code: 'EC'
            region: ''
        }
