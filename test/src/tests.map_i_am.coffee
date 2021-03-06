jQuery ->
  test 'Basic requirements', ->
    # Easel
    ok Stage, 'Easel::Stage'
    ok Rectangle, 'Easel::Rectangle'
    ok Shape, 'Easel::Shape'
    ok Graphics, 'Easel::Graphics'

    # MapIAm
    ok MapIAm, 'MapIAm'

  test 'MapIAm missing arguments', ->
    raises (-> new MapIAm),
      ((e) -> e == 'Err: canvas ID not specified!'),
      'throws message when canvas ID is not specified'

    raises (-> new MapIAm 'wrong-id'),
      ((e) -> e == 'Err: canvas ID incorrect, element not found!'),
      'throws message when canvas ID is not correct'

    raises (-> new MapIAm 'map_i_am-canvas'),
      ((e) -> e == 'Err: label ID not specified!'),
      'throws message when label ID is not specified'

    raises (-> new MapIAm 'map_i_am-canvas', 'wrong-id'),
      ((e) -> e == 'Err: label ID incorrect, element not found!'),
      'throws message when label ID is not correct'

    raises (-> new MapIAm 'map_i_am-canvas', 'region-label'),
      ((e) -> e == 'Err: countries map data not specified!'),
      'throws message when counries map data is not specified'

    raises (-> new MapIAm 'map_i_am-canvas', 'region-label', {}),
      ((e) -> e == 'Err: european countries map data not specified!'),
      'throws message when european counries map data is not specified'

    raises (-> new MapIAm 'map_i_am-canvas', 'region-label', {}, {}),
      ((e) -> e == 'Err: US states map data not specified!'),
      'throws message when US states map data is not specified'

  test 'MapIAm intialize', ->
    map_i_am = new MapIAm 'map_i_am-canvas', 'region-label', {}, {}, {}
    ok map_i_am, 'MapIAm instance map_i_am'

    ok map_i_am.stage, 'map_i_am.stage'
    ok map_i_am.stage.canvas, 'map_i_am.stage.canvas'

    canvas_width = 480
    canvas_height = 320

    ok map_i_am.stage_bounds, 'map_i_am.stage_bounds'
    equals map_i_am.stage_bounds.width, canvas_width, 'map_i_am.stage_bounds.width'
    equals map_i_am.stage_bounds.height, canvas_height, 'map_i_am.stage_bounds.height'
    equals map_i_am.stage_half_width, canvas_width / 2, 'map_i_am.stage_half_width'
    equals map_i_am.stage_half_height, canvas_height * (3 / 5), 'map_i_am.stage_half_height'

  test 'MapIAm defaults to world level', ->
    map_i_am = new MapIAm 'map_i_am-canvas', 'region-label', countries, {}, {}

    equals document.getElementById('region-label').innerHTML, 'World', 'changes map label text'

    equals map_i_am.stage.children[0].constructor, window.MapBackground, 'map_i_am.stage first child is background'

    equals map_i_am.active_scene.countries.length, countries.length, 'map_i_am should build all supplied countries'

    equals map_i_am.active_scene.countries[0].constructor, window.Country, 'map_i_am.world_scene.countries is filled with Country instances'

    equals map_i_am.active_scene.countries[0].regions.length, countries[0].borders.length, 'map_i_am should build all regions for a country'

    ok map_i_am.stage.calls[map_i_am.stage.calls.length - 1], "map_i_am.stage has been updated"
    equals map_i_am.stage.calls[map_i_am.stage.calls.length - 1].method, 'update', 'map_i_am renders stage'
