(function() {
  var MapIAm;
  MapIAm = (function() {
    function MapIAm(canvas_elem_id) {
      var canvas_dom;
      canvas_dom = document.getElementById(canvas_elem_id);
      this.stage = new Stage(canvas_dom);
      this.stage_bounds = new Rectangle;
      this.stage_bounds.width = canvas_dom.width;
      this.stage_bounds.height = canvas_dom.height;
      this.world_map_scene();
    }
    MapIAm.prototype.world_map_scene = function() {
      var borders, country, first_move, latlng, px, py, region, region_shape, stage_half_height, stage_half_width, xy, _i, _j, _k, _len, _len2, _len3, _ref;
      stage_half_width = this.stage_bounds.width / 2;
      stage_half_height = 3 / 5 * this.stage_bounds.height;
      for (_i = 0, _len = countries.length; _i < _len; _i++) {
        country = countries[_i];
        _ref = country.borders;
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          borders = _ref[_j];
          region = new Graphics();
          region.beginStroke('#8D98A7');
          region.beginFill('#F9FFEC');
          region.setStrokeStyle(1);
          region.moveTo(0, 0);
          first_move = true;
          for (_k = 0, _len3 = borders.length; _k < _len3; _k++) {
            latlng = borders[_k];
            xy = this.latlng_to_xy(latlng);
            px = xy.x * stage_half_width + stage_half_width;
            py = xy.y * stage_half_height + stage_half_height;
            if (first_move) {
              region.moveTo(px, py);
              first_move = false;
            } else {
              region.lineTo(px, py);
            }
          }
          region.endStroke();
          region.endFill();
          region_shape = new Shape(region);
          this.stage.addChild(region_shape);
        }
      }
      return this.stage.update();
    };
    MapIAm.prototype.latlng_to_xy = function(latlng) {
      return {
        x: latlng.lng / 180,
        y: latlng.lat / (0 - 90)
      };
    };
    return MapIAm;
  })();
  jQuery(function() {
    var map_i_am;
    return map_i_am = new MapIAm('map-canvas');
  });
}).call(this);
