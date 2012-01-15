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

    @stage_bounds = new Rectangle
    @stage_bounds.width = canvas_dom.width
    @stage_bounds.height = canvas_dom.height

    @stage_half_width = @stage_bounds.width / 2
    @stage_half_height = (3 / 5) * @stage_bounds.height

    @world_map_scene = @load_scene label_dom, 'World', all_countries_map_data, 1, 0, 0, @stage_half_width, @stage_half_height

  load_scene: (label_dom, label, map_data, scale, x_offset, y_offset, x_centering, y_centering) ->
    new MapScene label_dom, label, @stage_bounds, @stage, map_data, scale, x_offset, y_offset, x_centering, y_centering, @stage_half_width, @stage_half_height

window.MapScene = class
  constructor: (label_dom, label, stage_bounds, stage, map_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height) ->
    @countries = []

    label_dom.innerHTML = label

    background_options =
      'background-color': '#DAE8F2' # TODO style abstraction

    background = new MapBackground stage_bounds, background_options

    stage.addChild background

    for country in map_data
      @countries.push new Country stage, country, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height

    stage.update()

window.Country = class
  constructor: (stage, country_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height) ->
    @regions = []
    @name = country_data.name

    for borders in country_data.borders
      region = new Region borders, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height
      stage.addChild region
      @regions.push region

Region = class extends Shape
  constructor: (borders, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height) ->
    super()
    @graphics.beginStroke '#DDD' # TODO style abstraction
    @graphics.beginFill '#FFF' # TODO style abstraction
    @graphics.setStrokeStyle 1 # TODO style abstraction

    first_move = true

    @graphics.moveTo 0, 0

    for latlng in borders
      xy = @latlng_to_xy latlng
      px = xy.x * stage_half_width + stage_half_width
      py = xy.y * stage_half_height + stage_half_height

      px -= x_offset * stage_half_width + stage_half_width
      py -= y_offset * stage_half_height + stage_half_height

      px *= scale
      py *= scale

      px += x_centering
      py += y_centering

      if first_move
        @graphics.moveTo px, py
        first_move = false
      else
        @graphics.lineTo px, py

    @graphics.endStroke()
    @graphics.endFill()

  latlng_to_xy: (latlng) ->
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
