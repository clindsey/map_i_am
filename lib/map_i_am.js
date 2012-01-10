(function() {
  var MapIAm;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  MapIAm = (function() {
    function MapIAm(canvas_elem_id, country_name_elem_id) {
      var canvas_dom;
      canvas_dom = document.getElementById(canvas_elem_id);
      this.country_name_dom = document.getElementById(country_name_elem_id);
      this.stage = new Stage(canvas_dom);
      this.stage_bounds = new Rectangle;
      this.stage_bounds.width = canvas_dom.width;
      this.stage_bounds.height = canvas_dom.height;
      this.stage_half_width = this.stage_bounds.width / 2;
      this.stage_half_height = (3 / 5) * this.stage_bounds.height;
      this.world_map_scene();
    }
    MapIAm.prototype.world_map_scene = function() {
      var country, country_index, country_name, _i, _len;
      this.country_name_dom.innerHTML = 'World';
      country_index = -1;
      for (_i = 0, _len = countries.length; _i < _len; _i++) {
        country = countries[_i];
        country_name = country.name;
        country_index += 1;
        this.build_country(country, 1, 0, 0, this.stage_half_width, this.stage_half_height, __bind(function(region_shape) {
          return (__bind(function(country_index) {
            return region_shape.onClick = __bind(function() {
              this.stage.removeAllChildren();
              return this.country_map_scene(country_index);
            }, this);
          }, this))(country_index);
        }, this));
      }
      return this.stage.update();
    };
    MapIAm.prototype.country_map_scene = function(country_index) {
      var bounds, centering_x, centering_y, country, offset, scale, x_scale, xy_delta, y_scale;
      country = countries[country_index];
      this.country_name_dom.innerHTML = country.name;
      bounds = country.bounds;
      offset = this.latlng_to_xy(bounds);
      xy_delta = this.latlng_to_xy({
        lat: bounds.lat_delta,
        lng: bounds.lng_delta
      });
      x_scale = this.stage_bounds.width / (xy_delta.x * this.stage_half_width);
      y_scale = this.stage_bounds.height / (xy_delta.y * this.stage_half_height);
      scale = (x_scale > y_scale ? y_scale : x_scale) * 0.9;
      centering_x = (this.stage_bounds.width / 2) - ((xy_delta.x * this.stage_half_width * scale) / 2);
      centering_y = (this.stage_bounds.height / 2) - ((xy_delta.y * this.stage_half_height * scale) / 2);
      this.build_country(country, scale, offset.x, offset.y, centering_x, centering_y);
      return this.stage.update();
    };
    MapIAm.prototype.build_country = function(country, scale, offset_x, offset_y, centering_x, centering_y, callback) {
      var borders, first_move, latlng, px, py, region, region_shape, xy, _i, _j, _len, _len2, _ref, _results;
      _ref = country.borders;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        borders = _ref[_i];
        region = new Graphics();
        region.beginStroke('#8D98A7');
        region.beginFill('#F9FFEC');
        region.setStrokeStyle(1);
        region.moveTo(0, 0);
        first_move = true;
        for (_j = 0, _len2 = borders.length; _j < _len2; _j++) {
          latlng = borders[_j];
          xy = this.latlng_to_xy(latlng);
          px = xy.x * this.stage_half_width + this.stage_half_width;
          py = xy.y * this.stage_half_height + this.stage_half_height;
          px -= offset_x * this.stage_half_width + this.stage_half_width;
          py -= offset_y * this.stage_half_height + this.stage_half_height;
          px *= scale;
          py *= scale;
          px += centering_x;
          py += centering_y;
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
        _results.push(callback != null ? callback(region_shape) : void 0);
      }
      return _results;
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
    return map_i_am = new MapIAm('map-canvas', 'country-name');
  });
}).call(this);
