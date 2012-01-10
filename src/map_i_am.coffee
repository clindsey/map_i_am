class MapIAm
  constructor: (canvas_elem_id) ->
    canvas_dom = document.getElementById canvas_elem_id

    @stage = new Stage canvas_dom

    @stage_bounds = new Rectangle
    @stage_bounds.width = canvas_dom.width
    @stage_bounds.height = canvas_dom.height

    @world_map_scene()

  world_map_scene: ->
    stage_half_width = @stage_bounds.width / 2 # 'half width' in terms of longitude
    stage_half_height = 3 / 5 * @stage_bounds.height # 'half height' in terms of latitude

    for country in countries
      for borders in country.borders
        region = new Graphics()

        region.beginStroke '#8D98A7'
        region.beginFill '#F9FFEC'
        region.setStrokeStyle 1

        region.moveTo 0, 0
        first_move = true
        for latlng in borders
          xy = @latlng_to_xy latlng
          px = xy.x * stage_half_width + stage_half_width
          py = xy.y * stage_half_height + stage_half_height
          if first_move
            region.moveTo px, py
            first_move = false
          else
            region.lineTo px, py

        region.endStroke()
        region.endFill()

        region_shape = new Shape region
        @stage.addChild region_shape

    @stage.update()

  latlng_to_xy: (latlng) ->
    return x: latlng.lng / 180, y: latlng.lat / (0 - 90)

jQuery ->
  map_i_am = new MapIAm 'map-canvas'
