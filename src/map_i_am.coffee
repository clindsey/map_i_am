window.MapIAm = class
  constructor: (bind_canvas_elem_id, bind_label_elem_id, all_countries_map_data) ->
    throw 'Err: canvas ID not specified!' unless bind_canvas_elem_id?
    canvas_dom = document.getElementById bind_canvas_elem_id
    throw 'Err: canvas ID incorrect, element not found!' unless canvas_dom?

    throw 'Err: label ID not specified!' unless bind_label_elem_id?
    label_dom = document.getElementById bind_label_elem_id
    throw 'Err: label ID incorrect, element not found!' unless label_dom?

    throw 'Err: countries map data not specified!' unless all_countries_map_data?

    @stage = new Stage canvas_dom
    @stage.enableMouseOver()

    @stage_bounds = new Rectangle
    @stage_bounds.width = canvas_dom.width
    @stage_bounds.height = canvas_dom.height

    @stage_half_width = @stage_bounds.width / 2
    @stage_half_height = @stage_bounds.height * (3 / 5)

    @world_map_scene = new WorldMapScene label_dom, @stage_bounds, @stage, all_countries_map_data, @stage_half_width, @stage_half_height

window.MapScene = class
  constructor: (label_dom, label, stage_bounds, stage, map_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height, has_hover, callback) ->
    @countries = []

    label_dom.innerHTML = label

    stage.removeAllChildren()

    background_options =
      'background-color': '#DAE8F2' # TODO style abstraction

    background = new MapBackground stage_bounds, background_options
    background.onClick = ->
      callback() if callback?

    stage.addChild background

    for country in map_data
      @countries.push new Country stage, country, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height, has_hover, callback

    stage.update()

  determine_positioning: (country_data, stage_bounds, stage_half_width, stage_half_height) ->
    bounds = country_data.bounds
    xy_delta = latlng_to_xy lat: bounds.lat_delta, lng: bounds.lng_delta
    x_scale = stage_bounds.width  / (xy_delta.x * stage_half_width)
    y_scale = stage_bounds.height / (xy_delta.y * stage_half_height)
    scale = (if x_scale > y_scale then y_scale else x_scale) * 0.9
    positioning =
      offset: latlng_to_xy bounds
      scale: scale
      centering_x: ((stage_bounds.width / 2) - ((xy_delta.x * stage_half_width * scale) / 2))
      centering_y: ((stage_bounds.height / 2) - ((xy_delta.y * stage_half_height * scale) / 2))

WorldMapScene = class extends MapScene
  constructor: (label_dom, stage_bounds, stage, map_data, stage_half_width, stage_half_height) ->
    super label_dom, 'World', stage_bounds, stage, map_data, 1, 0, 0, stage_half_width, stage_half_height, stage_half_width, stage_half_height, true, (country) =>
      return unless country?
      if country.name == 'Europe'
        new EuropeanMapScene label_dom, stage_bounds, stage, [country, european_countries], stage_half_width, stage_half_height, =>
          new WorldMapScene  label_dom, stage_bounds, stage, map_data, stage_half_width, stage_half_height
      else if country.name == 'United States'
        new USMapScene label_dom, stage_bounds, stage, [country, states], stage_half_width, stage_half_height, =>
          new WorldMapScene  label_dom, stage_bounds, stage, map_data, stage_half_width, stage_half_height
      else
        new CountryMapScene label_dom, stage_bounds, stage, country, stage_half_width, stage_half_height, =>
          new WorldMapScene label_dom, stage_bounds, stage, map_data, stage_half_width, stage_half_height

EuropeanMapScene = class extends MapScene
  constructor: (label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback) ->
    europe_country = country_data_arr[0]
    country_data = country_data_arr[1]
    p = @determine_positioning europe_country, stage_bounds, stage_half_width, stage_half_height
    super label_dom, 'Europe', stage_bounds, stage, country_data, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, stage_half_width, stage_half_height, true, (country) =>
      unless country? and callback?
        callback()
      return unless country?
      new CountryMapScene label_dom, stage_bounds, stage, country, stage_half_width, stage_half_height, =>
        new EuropeanMapScene label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback

USMapScene = class extends MapScene
  constructor: (label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback) ->
    us_country = country_data_arr[0]
    country_data = country_data_arr[1]
    p = @determine_positioning us_country, stage_bounds, stage_half_width, stage_half_height
    super label_dom, 'United States', stage_bounds, stage, country_data, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, stage_half_width, stage_half_height, true, (country) =>
      unless country? and callback?
        callback()
      return unless country?
      new CountryMapScene label_dom, stage_bounds, stage, country, stage_half_width, stage_half_height, =>
        new USMapScene label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback

CountryMapScene = class extends MapScene
  constructor: (label_dom, stage_bounds, stage, country_data, stage_half_width, stage_half_height, callback) ->
    p = @determine_positioning country_data, stage_bounds, stage_half_width, stage_half_height
    super label_dom, country_data.name, stage_bounds, stage, [country_data], p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, stage_half_width, stage_half_height, false, callback

window.Country = class
  constructor: (stage, country_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height, has_hover, callback) ->
    @regions = []
    @name = country_data.name

    for borders in country_data.borders
      region = new Region borders, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height
      stage.addChild region
      @regions.push region

      region.onClick = ->
        callback country_data if callback?
      if has_hover == true
        region.onMouseOver = =>
          for r in @regions
            stage.removeChild r
            r.show_hover_state()
            stage.addChild r
          stage.update()
        region.onMouseOut = =>
          for r in @regions
            r.show_normal_state()
          stage.update()

Region = class extends Shape
  constructor: (@borders, @scale, @x_offset, @y_offset, @x_centering, @y_centering, @stage_half_width, @stage_half_height) ->
    super()
    @show_normal_state()

  show_normal_state: ->
    @render_region '#FFF', '#DDD', 1 # TODO style abstraction

  show_hover_state: ->
    @render_region '#FBB', '#333', 1 # TODO style abstraction

  render_region: (country_color, border_color, border_width) ->
    @graphics.clear()
    @graphics.beginFill country_color
    @graphics.beginStroke border_color
    @graphics.setStrokeStyle border_width

    first_move = true

    @graphics.moveTo 0, 0

    for latlng in @borders
      xy = latlng_to_xy latlng
      px = xy.x * @stage_half_width + @stage_half_width
      py = xy.y * @stage_half_height + @stage_half_height

      px -= @x_offset * @stage_half_width + @stage_half_width
      py -= @y_offset * @stage_half_height + @stage_half_height

      px *= @scale
      py *= @scale

      px += @x_centering
      py += @y_centering

      if first_move
        @graphics.moveTo px, py
        first_move = false
      else
        @graphics.lineTo px, py

    @graphics.endStroke()
    @graphics.endFill()

latlng_to_xy =  (latlng) ->
  { x: latlng.lng / 180, y: latlng.lat / (0 - 90) }

window.MapBackground = class extends Shape
  constructor: (stage_bounds, options) ->
    super()

    @graphics.beginFill options['background-color']
    @graphics.moveTo 0, 0
    @graphics.lineTo stage_bounds.width, 0
    @graphics.lineTo stage_bounds.width, stage_bounds.height
    @graphics.lineTo 0, stage_bounds.height
    @graphics.endFill()
