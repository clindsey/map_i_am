class MapIAm
  EUROPE_COUNTRY_INDEX: 143
  US_COUNTRY_INDEX: 7
  BACKGROUND_COLOR: '#C3D3E0'
  COUNTRY_COLOR: '#F9FFEC'
  COUNTRY_BORDER_COLOR: '#8D98A7'
  COUNTRY_BORDER_WIDTH: 1
  MARKER_COLOR: '#880000'
  MARKER_RADIUS: 4
  MARKER_BORDER_WIDTH: 1
  MARKER_BORDER_COLOR: Graphics.getRGB(100, 0, 0, 0.75)
  US_STATE_LOOKUP: {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","District of Columbia":"DC","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY","American Samoa":"AS","Guam":"GU","Northern Mariana Islands":"MP","Puerto Rico":"PR","Virgin Islands":"VI","U.S. Minor Outlying Islands":"","Federated States of Micronesia":"FM","Marshall Islands":"MH","Palau":"PW","Armed Forces\n- Americas (except Canada)":"AA","Armed Forces\n- Europe\n- Canada\n- Middle East\n- Africa":"AE","Armed Forces\n- Pacific":"AP","Canal Zone":"CZ","Philippine Islands":"PI","Trust Territory of the Pacific Islands":"TT","Commonwealth of the Northern Mariana Islands":"CM"}
  markers: {}
  constructor: (canvas_elem_id, country_name_elem_id, markers) ->
    @markers = markers if markers?
    canvas_dom = document.getElementById canvas_elem_id
    @country_name_dom = document.getElementById country_name_elem_id

    @stage = new Stage canvas_dom

    @stage_bounds = new Rectangle
    @stage_bounds.width = canvas_dom.width
    @stage_bounds.height = canvas_dom.height

    @stage_half_width = @stage_bounds.width / 2
    @stage_half_height = (3 / 5) * @stage_bounds.height

    @world_map_scene()

  world_map_scene: ->
    @build_scene 'World'

    @build_region countries, 1, 0, 0, @stage_half_width, @stage_half_height, (country) =>
      if country.name == 'Europe'
        @europe_map_scene()
      else if country.name == 'United States'
        @us_map_scene()
      else
        @country_map_scene country, =>
          @world_map_scene()

    for name, marker of @markers
      @plot_marker marker, 1, 0, 0, @stage_half_width, @stage_half_height

    @stage.update()

  us_map_scene: ->
    @build_scene 'United States', =>
      @stage.removeAllChildren()
      @world_map_scene()

    country = countries[@US_COUNTRY_INDEX]

    p = @determine_positioning country

    @build_region states, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, (country) =>
      @country_map_scene country, =>
        @us_map_scene()

    for name, marker of @markers
      if marker.country_code == 'US'
        @plot_marker marker, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y

    @stage.update()

  europe_map_scene: ->
    @build_scene 'Europe', =>
      @stage.removeAllChildren()
      @world_map_scene()

    country = countries[@EUROPE_COUNTRY_INDEX]

    p = @determine_positioning country

    @build_region european_countries, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, (country) =>
      @country_map_scene country, =>
        @europe_map_scene()

    for name, marker of @markers
      for country in european_countries
        if marker.country_code == country.code
          @plot_marker marker, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y

    @stage.update()

  country_map_scene: (country, callback) ->
    @build_scene country.name, =>
      @stage.removeAllChildren()
      callback() if callback?

    p = @determine_positioning country

    @build_country country, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y

    for name, marker of @markers
      if marker.country_code == 'US'
        for state, state_abbr of @US_STATE_LOOKUP
          if marker.region == state_abbr
            @plot_marker marker, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y
      else if marker.country_code == country.code
        @plot_marker marker, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y

    @stage.update()

  build_scene: (scene_name, callback) ->
    background = @create_background()
    @stage.addChild background
    background.onClick = callback if callback?

    @country_name_dom.innerHTML = scene_name

  determine_positioning: (country) ->
    bounds = country.bounds
    xy_delta = @latlng_to_xy lat: bounds.lat_delta, lng: bounds.lng_delta
    x_scale = @stage_bounds.width / (xy_delta.x * @stage_half_width)
    y_scale = @stage_bounds.height / (xy_delta.y * @stage_half_height)
    scale = (if x_scale > y_scale then y_scale else x_scale) * 0.9
    positioning =
      offset: @latlng_to_xy bounds
      scale: scale
      centering_x: ((@stage_bounds.width / 2) - ((xy_delta.x * @stage_half_width * scale) / 2))
      centering_y: ((@stage_bounds.height / 2) - ((xy_delta.y * @stage_half_height * scale) / 2))

    positioning

  build_region: (countries, scale, x_offset, y_offset, x_centering, y_centering, callback) ->
    country_index = -1

    for country in countries
      country_name = country.name
      country_index += 1

      @build_country country, scale, x_offset, y_offset, x_centering, y_centering, (region_shape) =>
        ((country, country_index, callback) =>
          region_shape.onClick = =>
            @stage.removeAllChildren()
            callback country if callback?
        )(country, country_index, callback)

  build_country: (country, scale, offset_x, offset_y, centering_x, centering_y, callback) ->
    for borders in country.borders
      region = new Graphics()

      region.beginStroke @COUNTRY_BORDER_COLOR
      region.beginFill @COUNTRY_COLOR
      region.setStrokeStyle @COUNTRY_BORDER_WIDTH

      region.moveTo 0, 0
      first_move = true

      for latlng in borders
        xy = @latlng_to_xy latlng
        px = xy.x * @stage_half_width + @stage_half_width
        py = xy.y * @stage_half_height + @stage_half_height

        px -= offset_x * @stage_half_width + @stage_half_width
        py -= offset_y * @stage_half_height + @stage_half_height

        px *= scale
        py *= scale

        px += centering_x
        py += centering_y

        if first_move
          region.moveTo px, py
          first_move = false

        else
          region.lineTo px, py

      region.endStroke()
      region.endFill()

      region_shape = new Shape region

      @stage.addChild region_shape

      callback region_shape if callback?

  create_background: () ->
    background = new Shape()

    background.graphics.beginFill @BACKGROUND_COLOR
    background.graphics.moveTo(0, 0)
    background.graphics.lineTo(@stage_bounds.width, 0)
    background.graphics.lineTo(@stage_bounds.width, @stage_bounds.height)
    background.graphics.lineTo(0, @stage_bounds.height)
    background.graphics.endFill()

    background

  latlng_to_xy: (latlng) ->
    { x: latlng.lng / 180, y: latlng.lat / (0 - 90) }

  add_marker: (name, lat, lng, country_code, region) ->
    @markers[name] = { lat: lat, lng: lng, country_code: country_code, region: region }

  update: ->
    @stage.update()

  create_map_marker: (x, y) ->
    marker = new Shape()

    marker.graphics.setStrokeStyle @MARKER_BORDER_WIDTH
    marker.graphics.beginStroke @MARKER_BORDER_COLOR
    marker.graphics.beginFill @MARKER_COLOR
    marker.graphics.drawCircle 0, 0, @MARKER_RADIUS

    marker.x = x
    marker.y = y

    @stage.addChild marker

  plot_marker: (marker, scale, offset_x, offset_y, centering_x, centering_y) ->
    xy = @latlng_to_xy { lat: marker.lat, lng: marker.lng }
    px = xy.x * @stage_half_width + @stage_half_width
    py = xy.y * @stage_half_height + @stage_half_height

    px -= offset_x * @stage_half_width + @stage_half_width
    py -= offset_y * @stage_half_height + @stage_half_height

    px *= scale
    py *= scale

    px += centering_x
    py += centering_y

    @create_map_marker px, py

window.MapIAm = MapIAm
