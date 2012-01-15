(function() {
  jQuery(function() {
    test('Basic requirements', function() {
      ok(Stage, 'Easel::Stage');
      ok(Rectangle, 'Easel::Rectangle');
      ok(Shape, 'Easel::Shape');
      ok(Graphics, 'Easel::Graphics');
      return ok(MapIAm, 'MapIAm');
    });
    test('MapIAm missing arguments', function() {
      raises((function() {
        return new MapIAm;
      }), (function(e) {
        return e === 'Err: canvas ID not specified!';
      }), 'throws message when canvas ID is not specified');
      raises((function() {
        return new MapIAm('wrong-id');
      }), (function(e) {
        return e === 'Err: canvas ID incorrect, element not found!';
      }), 'throws message when canvas ID is not correct');
      raises((function() {
        return new MapIAm('map_i_am-canvas');
      }), (function(e) {
        return e === 'Err: label ID not specified!';
      }), 'throws message when label ID is not specified');
      raises((function() {
        return new MapIAm('map_i_am-canvas', 'wrong-id');
      }), (function(e) {
        return e === 'Err: label ID incorrect, element not found!';
      }), 'throws message when label ID is not correct');
      return raises((function() {
        return new MapIAm('map_i_am-canvas', 'region-label');
      }), (function(e) {
        return e === 'Err: countries map data not specified!';
      }), 'throws message when counries map data is not specified');
    });
    test('MapIAm intialize', function() {
      var canvas_height, canvas_width, map_i_am;
      map_i_am = new MapIAm('map_i_am-canvas', 'region-label', {});
      ok(map_i_am, 'MapIAm instance map_i_am');
      ok(map_i_am.stage, 'map_i_am.stage');
      ok(map_i_am.stage.canvas, 'map_i_am.stage.canvas');
      canvas_width = 480;
      canvas_height = 320;
      ok(map_i_am.stage_bounds, 'map_i_am.stage_bounds');
      equals(map_i_am.stage_bounds.width, canvas_width, 'map_i_am.stage_bounds.width');
      equals(map_i_am.stage_bounds.height, canvas_height, 'map_i_am.stage_bounds.height');
      equals(map_i_am.stage_half_width, canvas_width / 2, 'map_i_am.stage_half_width');
      return equals(map_i_am.stage_half_height, canvas_height * (3 / 5), 'map_i_am.stage_half_height');
    });
    return test('MapIAm defaults to world level', function() {
      var map_i_am;
      map_i_am = new MapIAm('map_i_am-canvas', 'region-label', countries);
      equals(document.getElementById('region-label').innerHTML, 'World', 'changes map label text');
      equals(map_i_am.stage.children[0].constructor, window.MapBackground, 'map_i_am.stage first child is background');
      equals(map_i_am.world_map_scene.countries.length, countries.length, 'map_i_am should build all supplied countries');
      equals(map_i_am.world_map_scene.countries[0].constructor, window.Country, 'map_i_am.world_scene.countries is filled with Country instances');
      equals(map_i_am.world_map_scene.countries[0].regions.length, countries[0].borders.length, 'map_i_am should build all regions for a country');
      ok(map_i_am.stage.calls[map_i_am.stage.calls.length - 1], "map_i_am.stage has been updated");
      return equals(map_i_am.stage.calls[map_i_am.stage.calls.length - 1].method, 'update', 'map_i_am renders stage');
    });
  });
}).call(this);
