(function() {
  var MapIAm;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  MapIAm = (function() {
    MapIAm.prototype.EUROPE_COUNTRY_INDEX = 143;
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
    MapIAm.prototype.build_scene = function(scene_name, callback) {
      var background;
      background = this.create_background();
      this.stage.addChild(background);
      if (callback != null) {
        background.onClick = callback;
      }
      return this.country_name_dom.innerHTML = scene_name;
    };
    MapIAm.prototype.world_map_scene = function() {
      this.build_scene('World');
      this.build_region(countries, 1, 0, 0, this.stage_half_width, this.stage_half_height, __bind(function(country) {
        if (country.name === 'Europe') {
          return this.europe_map_scene();
        } else {
          return this.country_map_scene(country, __bind(function() {
            return this.world_map_scene();
          }, this));
        }
      }, this));
      return this.stage.update();
    };
    MapIAm.prototype.europe_map_scene = function() {
      var country, p;
      this.build_scene('Europe', __bind(function() {
        this.stage.removeAllChildren();
        return this.world_map_scene();
      }, this));
      country = countries[this.EUROPE_COUNTRY_INDEX];
      p = this.determine_positioning(country);
      this.build_region(european_countries, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, __bind(function(country) {
        return this.country_map_scene(country, __bind(function() {
          return this.europe_map_scene();
        }, this));
      }, this));
      return this.stage.update();
    };
    MapIAm.prototype.country_map_scene = function(country, callback) {
      var p;
      this.build_scene(country.name, __bind(function() {
        this.stage.removeAllChildren();
        if (callback != null) {
          return callback();
        }
      }, this));
      p = this.determine_positioning(country);
      this.build_country(country, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y);
      return this.stage.update();
    };
    MapIAm.prototype.determine_positioning = function(country) {
      var bounds, positioning, scale, x_scale, xy_delta, y_scale;
      bounds = country.bounds;
      xy_delta = this.latlng_to_xy({
        lat: bounds.lat_delta,
        lng: bounds.lng_delta
      });
      x_scale = this.stage_bounds.width / (xy_delta.x * this.stage_half_width);
      y_scale = this.stage_bounds.height / (xy_delta.y * this.stage_half_height);
      scale = (x_scale > y_scale ? y_scale : x_scale) * 0.9;
      positioning = {
        offset: this.latlng_to_xy(bounds),
        scale: scale,
        centering_x: (this.stage_bounds.width / 2) - ((xy_delta.x * this.stage_half_width * scale) / 2),
        centering_y: (this.stage_bounds.height / 2) - ((xy_delta.y * this.stage_half_height * scale) / 2)
      };
      return positioning;
    };
    MapIAm.prototype.build_region = function(countries, scale, x_offset, y_offset, x_centering, y_centering, callback) {
      var country, country_index, country_name, _i, _len, _results;
      country_index = -1;
      _results = [];
      for (_i = 0, _len = countries.length; _i < _len; _i++) {
        country = countries[_i];
        country_name = country.name;
        country_index += 1;
        _results.push(this.build_country(country, scale, x_offset, y_offset, x_centering, y_centering, __bind(function(region_shape) {
          return (__bind(function(country, country_index, callback) {
            return region_shape.onClick = __bind(function() {
              this.stage.removeAllChildren();
              if (callback != null) {
                return callback(country);
              }
            }, this);
          }, this))(country, country_index, callback);
        }, this)));
      }
      return _results;
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
    MapIAm.prototype.create_background = function() {
      var background;
      background = new Shape();
      background.graphics.beginFill('#C3D3E0');
      background.graphics.moveTo(0, 0);
      background.graphics.lineTo(this.stage_bounds.width, 0);
      background.graphics.lineTo(this.stage_bounds.width, this.stage_bounds.height);
      background.graphics.lineTo(0, this.stage_bounds.height);
      background.graphics.endFill();
      return background;
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
