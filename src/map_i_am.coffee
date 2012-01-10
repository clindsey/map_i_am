class MapIAm
  EUROPE_COUNTRY_INDEX: 143
  US_COUNTRY_INDEX: 7
  constructor: (canvas_elem_id, country_name_elem_id) ->
    canvas_dom = document.getElementById canvas_elem_id
    @country_name_dom = document.getElementById country_name_elem_id

    @stage = new Stage canvas_dom

    @stage_bounds = new Rectangle
    @stage_bounds.width = canvas_dom.width
    @stage_bounds.height = canvas_dom.height

    @stage_half_width = @stage_bounds.width / 2
    @stage_half_height = (3 / 5) * @stage_bounds.height

    @world_map_scene()

  build_scene: (scene_name, callback) ->
    background = @create_background()
    @stage.addChild background
    background.onClick = callback if callback?

    @country_name_dom.innerHTML = scene_name

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

    @stage.update()

  country_map_scene: (country, callback) ->
    @build_scene country.name, =>
      @stage.removeAllChildren()
      callback() if callback?

    p = @determine_positioning country

    @build_country country, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y

    @stage.update()

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

      region.beginStroke '#8D98A7'
      region.beginFill '#F9FFEC'
      region.setStrokeStyle 1

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

    background.graphics.beginFill '#C3D3E0'
    background.graphics.moveTo(0, 0)
    background.graphics.lineTo(@stage_bounds.width, 0)
    background.graphics.lineTo(@stage_bounds.width, @stage_bounds.height)
    background.graphics.lineTo(0, @stage_bounds.height)
    background.graphics.endFill()

    background

  latlng_to_xy: (latlng) ->
    { x: latlng.lng / 180, y: latlng.lat / (0 - 90) }

jQuery ->
  map_i_am = new MapIAm 'map-canvas', 'country-name'
