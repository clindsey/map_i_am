(function() {
  var ContinentMapScene, CountryMapScene, EuropeanMapScene, Region, USMapScene, WorldMapScene, latlng_to_xy;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.MapIAm = (function() {
    function _Class(bind_canvas_elem_id, bind_label_elem_id, all_countries_map_data) {
      var canvas_dom, label_dom;
      if (bind_canvas_elem_id == null) {
        throw 'Err: canvas ID not specified!';
      }
      canvas_dom = document.getElementById(bind_canvas_elem_id);
      if (canvas_dom == null) {
        throw 'Err: canvas ID incorrect, element not found!';
      }
      if (bind_label_elem_id == null) {
        throw 'Err: label ID not specified!';
      }
      label_dom = document.getElementById(bind_label_elem_id);
      if (label_dom == null) {
        throw 'Err: label ID incorrect, element not found!';
      }
      if (all_countries_map_data == null) {
        throw 'Err: countries map data not specified!';
      }
      this.stage = new Stage(canvas_dom);
      this.stage.enableMouseOver();
      this.stage_bounds = new Rectangle;
      this.stage_bounds.width = canvas_dom.width;
      this.stage_bounds.height = canvas_dom.height;
      this.stage_half_width = this.stage_bounds.width / 2;
      this.stage_half_height = this.stage_bounds.height * (3 / 5);
      this.world_map_scene = new WorldMapScene(label_dom, this.stage_bounds, this.stage, all_countries_map_data, this.stage_half_width, this.stage_half_height);
    }
    return _Class;
  })();
  window.MapScene = (function() {
    function _Class(label_dom, label, stage_bounds, stage, map_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height, has_hover, callback) {
      var background, background_options, country, _i, _len;
      this.countries = [];
      label_dom.innerHTML = label;
      stage.removeAllChildren();
      background_options = {
        'background-color': '#DAE8F2'
      };
      background = new MapBackground(stage_bounds, background_options);
      background.onClick = function() {
        if (callback != null) {
          return callback();
        }
      };
      stage.addChild(background);
      for (_i = 0, _len = map_data.length; _i < _len; _i++) {
        country = map_data[_i];
        this.countries.push(new Country(stage, country, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height, has_hover, callback));
      }
      stage.update();
    }
    _Class.prototype.determine_positioning = function(country_data, stage_bounds, stage_half_width, stage_half_height) {
      var bounds, positioning, scale, x_scale, xy_delta, y_scale;
      bounds = country_data.bounds;
      xy_delta = latlng_to_xy({
        lat: bounds.lat_delta,
        lng: bounds.lng_delta
      });
      x_scale = stage_bounds.width / (xy_delta.x * stage_half_width);
      y_scale = stage_bounds.height / (xy_delta.y * stage_half_height);
      scale = (x_scale > y_scale ? y_scale : x_scale) * 0.9;
      return positioning = {
        offset: latlng_to_xy(bounds),
        scale: scale,
        centering_x: (stage_bounds.width / 2) - ((xy_delta.x * stage_half_width * scale) / 2),
        centering_y: (stage_bounds.height / 2) - ((xy_delta.y * stage_half_height * scale) / 2)
      };
    };
    return _Class;
  })();
  WorldMapScene = (function() {
    __extends(_Class, MapScene);
    function _Class(label_dom, stage_bounds, stage, map_data, stage_half_width, stage_half_height) {
      _Class.__super__.constructor.call(this, label_dom, 'World', stage_bounds, stage, map_data, 1, 0, 0, stage_half_width, stage_half_height, stage_half_width, stage_half_height, true, __bind(function(country) {
        var to_level_zoom_callback;
        if (country == null) {
          return;
        }
        to_level_zoom_callback = __bind(function() {
          return new WorldMapScene(label_dom, stage_bounds, stage, map_data, stage_half_width, stage_half_height);
        }, this);
        if (country.name === 'Europe') {
          return new EuropeanMapScene(label_dom, stage_bounds, stage, [country, european_countries], stage_half_width, stage_half_height, to_level_zoom_callback);
        } else if (country.name === 'United States') {
          return new USMapScene(label_dom, stage_bounds, stage, [country, states], stage_half_width, stage_half_height, to_level_zoom_callback);
        } else {
          return new CountryMapScene(label_dom, stage_bounds, stage, country, stage_half_width, stage_half_height, to_level_zoom_callback);
        }
      }, this));
    }
    return _Class;
  })();
  ContinentMapScene = (function() {
    __extends(_Class, MapScene);
    function _Class(label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback_class, callback) {
      var continent_country, country_data, p;
      this.callback_class = callback_class;
      continent_country = country_data_arr[0];
      country_data = country_data_arr[1];
      p = this.determine_positioning(continent_country, stage_bounds, stage_half_width, stage_half_height);
      _Class.__super__.constructor.call(this, label_dom, continent_country.name, stage_bounds, stage, country_data, p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, stage_half_width, stage_half_height, true, __bind(function(country) {
        if (!((country != null) && (callback != null))) {
          callback();
        }
        if (country == null) {
          return;
        }
        return new CountryMapScene(label_dom, stage_bounds, stage, country, stage_half_width, stage_half_height, __bind(function() {
          return new this.callback_class(label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback);
        }, this));
      }, this));
    }
    return _Class;
  })();
  EuropeanMapScene = (function() {
    __extends(_Class, ContinentMapScene);
    function _Class(label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback) {
      _Class.__super__.constructor.call(this, label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, EuropeanMapScene, callback);
    }
    return _Class;
  })();
  USMapScene = (function() {
    __extends(_Class, ContinentMapScene);
    function _Class(label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, callback) {
      _Class.__super__.constructor.call(this, label_dom, stage_bounds, stage, country_data_arr, stage_half_width, stage_half_height, USMapScene, callback);
    }
    return _Class;
  })();
  CountryMapScene = (function() {
    __extends(_Class, MapScene);
    function _Class(label_dom, stage_bounds, stage, country_data, stage_half_width, stage_half_height, callback) {
      var p;
      p = this.determine_positioning(country_data, stage_bounds, stage_half_width, stage_half_height);
      _Class.__super__.constructor.call(this, label_dom, country_data.name, stage_bounds, stage, [country_data], p.scale, p.offset.x, p.offset.y, p.centering_x, p.centering_y, stage_half_width, stage_half_height, false, callback);
    }
    return _Class;
  })();
  window.Country = (function() {
    function _Class(stage, country_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height, has_hover, callback) {
      var borders, region, _i, _len, _ref;
      this.regions = [];
      this.name = country_data.name;
      _ref = country_data.borders;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        borders = _ref[_i];
        region = new Region(borders, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height);
        stage.addChild(region);
        this.regions.push(region);
        region.onClick = function() {
          if (callback != null) {
            return callback(country_data);
          }
        };
        if (has_hover === true) {
          region.onMouseOver = __bind(function() {
            var r, _j, _len2, _ref2;
            _ref2 = this.regions;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              r = _ref2[_j];
              stage.removeChild(r);
              r.show_hover_state();
              stage.addChild(r);
            }
            return stage.update();
          }, this);
          region.onMouseOut = __bind(function() {
            var r, _j, _len2, _ref2;
            _ref2 = this.regions;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              r = _ref2[_j];
              r.show_normal_state();
            }
            return stage.update();
          }, this);
        }
      }
    }
    return _Class;
  })();
  Region = (function() {
    __extends(_Class, Shape);
    function _Class(borders, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height) {
      this.borders = borders;
      this.scale = scale;
      this.x_offset = x_offset;
      this.y_offset = y_offset;
      this.x_centering = x_centering;
      this.y_centering = y_centering;
      this.stage_half_width = stage_half_width;
      this.stage_half_height = stage_half_height;
      _Class.__super__.constructor.call(this);
      this.show_normal_state();
    }
    _Class.prototype.show_normal_state = function() {
      return this.render_region('#FFF', '#DDD', 1);
    };
    _Class.prototype.show_hover_state = function() {
      return this.render_region('#FBB', '#333', 1);
    };
    _Class.prototype.render_region = function(country_color, border_color, border_width) {
      var first_move, latlng, px, py, xy, _i, _len, _ref;
      this.graphics.clear();
      this.graphics.beginFill(country_color);
      this.graphics.beginStroke(border_color);
      this.graphics.setStrokeStyle(border_width);
      first_move = true;
      this.graphics.moveTo(0, 0);
      _ref = this.borders;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        latlng = _ref[_i];
        xy = latlng_to_xy(latlng);
        px = xy.x * this.stage_half_width + this.stage_half_width;
        py = xy.y * this.stage_half_height + this.stage_half_height;
        px -= this.x_offset * this.stage_half_width + this.stage_half_width;
        py -= this.y_offset * this.stage_half_height + this.stage_half_height;
        px *= this.scale;
        py *= this.scale;
        px += this.x_centering;
        py += this.y_centering;
        if (first_move) {
          this.graphics.moveTo(px, py);
          first_move = false;
        } else {
          this.graphics.lineTo(px, py);
        }
      }
      this.graphics.endStroke();
      return this.graphics.endFill();
    };
    return _Class;
  })();
  latlng_to_xy = function(latlng) {
    return {
      x: latlng.lng / 180,
      y: latlng.lat / (0 - 90)
    };
  };
  window.MapBackground = (function() {
    __extends(_Class, Shape);
    function _Class(stage_bounds, options) {
      _Class.__super__.constructor.call(this);
      this.graphics.beginFill(options['background-color']);
      this.graphics.moveTo(0, 0);
      this.graphics.lineTo(stage_bounds.width, 0);
      this.graphics.lineTo(stage_bounds.width, stage_bounds.height);
      this.graphics.lineTo(0, stage_bounds.height);
      this.graphics.endFill();
    }
    return _Class;
  })();
}).call(this);
