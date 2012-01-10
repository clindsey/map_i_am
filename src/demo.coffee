window.session =
  options:
    gapi_locations: true
  start: (session) ->
    jQuery () -> # barf
      map_i_am.add_marker 'user_0', session.location.latitude, session.location.longitude
      map_i_am.update()
