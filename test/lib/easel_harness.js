(function() {
  var EaselGraphics, Harness;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Harness = (function() {
    _Class.prototype.slice = Array.prototype.slice;
    function _Class(methods) {
      var method, _fn, _i, _len, _ref;
      this.calls = [];
      _ref = methods.split(/\s+/);
      _fn = __bind(function(method) {
        return this[method] = __bind(function() {
          return this.calls.push({
            method: method,
            args: this.slice.call(arguments)
          });
        }, this);
      }, this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        _fn(method);
      }
    }
    return _Class;
  })();
  window.Stage = (function() {
    __extends(_Class, Harness);
    function _Class() {
      _Class.__super__.constructor.call(this, "update");
      this.canvas = {};
      this.children = [];
    }
    _Class.prototype.addChild = function(display_object) {
      return this.children.push(display_object);
    };
    return _Class;
  })();
  EaselGraphics = (function() {
    __extends(_Class, Harness);
    function _Class() {
      _Class.__super__.constructor.call(this, "beginFill endFill beginStroke endStroke moveTo lineTo setStrokeStyle");
    }
    return _Class;
  })();
  window.Rectangle = (function() {
    function _Class() {}
    return _Class;
  })();
  window.Graphics = (function() {
    __extends(_Class, EaselGraphics);
    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }
    return _Class;
  })();
  window.Shape = (function() {
    function _Class() {
      this.graphics = new window.Graphics();
    }
    return _Class;
  })();
}).call(this);
