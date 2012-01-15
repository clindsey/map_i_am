(function() {
  window.on_load = function() {
    var map;
    return map = new MapIAm('map_i_am-canvas', 'map_i_am-label', countries);
  };
}).call(this);
