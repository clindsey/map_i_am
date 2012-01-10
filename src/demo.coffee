window.session =
  options:
    gapi_locations: true
  start: (session) ->
    jQuery () -> # barf
      map_i_am = new MapIAm 'map-canvas', 'country-name', {
          'me':
            lat: session.location.latitude
            lng: session.location.longitude
            country_code: session.location.address.country_code
            region: session.location.address.region
        }
      map_i_am.update()
