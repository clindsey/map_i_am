window.session =
  options:
    gapi_locations: true
  start: (session) ->
    jQuery -> # barf
      map_i_am = new MapIAm 'map-canvas', 'country-name', {
          'Jacob':
            lat: if session?.location?.latitude? then session.location.latitude else -26.057053
            lng: if session?.location?.longitude? then session.location.longitude else 145.305433
            country_code: if session?.location?.address?.country_code? then session.location.address.country_code else 'AU'
            region: if session?.location?.address?.region? then session.location.address.region else ''
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
