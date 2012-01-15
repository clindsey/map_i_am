(function() {
  var Region;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
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
      this.stage_bounds = new Rectangle;
      this.stage_bounds.width = canvas_dom.width;
      this.stage_bounds.height = canvas_dom.height;
      this.stage_half_width = this.stage_bounds.width / 2;
      this.stage_half_height = (3 / 5) * this.stage_bounds.height;
      this.world_map_scene = this.load_scene(label_dom, 'World', all_countries_map_data, 1, 0, 0, this.stage_half_width, this.stage_half_height);
    }
    _Class.prototype.load_scene = function(label_dom, label, map_data, scale, x_offset, y_offset, x_centering, y_centering) {
      return new MapScene(label_dom, label, this.stage_bounds, this.stage, map_data, scale, x_offset, y_offset, x_centering, y_centering, this.stage_half_width, this.stage_half_height);
    };
    return _Class;
  })();
  window.MapScene = (function() {
    function _Class(label_dom, label, stage_bounds, stage, map_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height) {
      var background, background_options, country, _i, _len;
      this.countries = [];
      label_dom.innerHTML = label;
      background_options = {
        'background-color': '#DAE8F2'
      };
      background = new MapBackground(stage_bounds, background_options);
      stage.addChild(background);
      for (_i = 0, _len = map_data.length; _i < _len; _i++) {
        country = map_data[_i];
        this.countries.push(new Country(stage, country, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height));
      }
      stage.update();
    }
    return _Class;
  })();
  window.Country = (function() {
    function _Class(stage, country_data, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height) {
      var borders, region, _i, _len, _ref;
      this.regions = [];
      this.name = country_data.name;
      _ref = country_data.borders;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        borders = _ref[_i];
        region = new Region(borders, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height);
        stage.addChild(region);
        this.regions.push(region);
      }
    }
    return _Class;
  })();
  Region = (function() {
    __extends(_Class, Shape);
    function _Class(borders, scale, x_offset, y_offset, x_centering, y_centering, stage_half_width, stage_half_height) {
      var first_move, latlng, px, py, xy, _i, _len;
      _Class.__super__.constructor.call(this);
      this.graphics.beginStroke('#DDD');
      this.graphics.beginFill('#FFF');
      this.graphics.setStrokeStyle(1);
      first_move = true;
      this.graphics.moveTo(0, 0);
      for (_i = 0, _len = borders.length; _i < _len; _i++) {
        latlng = borders[_i];
        xy = this.latlng_to_xy(latlng);
        px = xy.x * stage_half_width + stage_half_width;
        py = xy.y * stage_half_height + stage_half_height;
        px -= x_offset * stage_half_width + stage_half_width;
        py -= y_offset * stage_half_height + stage_half_height;
        px *= scale;
        py *= scale;
        px += x_centering;
        py += y_centering;
        if (first_move) {
          this.graphics.moveTo(px, py);
          first_move = false;
        } else {
          this.graphics.lineTo(px, py);
        }
      }
      this.graphics.endStroke();
      this.graphics.endFill();
    }
    _Class.prototype.latlng_to_xy = function(latlng) {
      return {
        x: latlng.lng / 180,
        y: latlng.lat / (0 - 90)
      };
    };
    return _Class;
  })();
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
