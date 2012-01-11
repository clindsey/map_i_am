describe("MapIAm", function() {
  var map_i_am;

  function setup_map_i_am(){
    countries = [{"code":"US","name":"United States","borders":[]}];
    var canvas = document.createElement('canvas')
    canvas.id = 'map_canvas';
    document.body.appendChild(canvas);
    var country_name = document.createElement('div');
    country_name.id = 'country_name';
    document.body.appendChild(country_name);
    map_i_am = new MapIAm(canvas.id, country_name.id, countries);
  }

  beforeEach(function() {
    setup_map_i_am();
  });

  it("should not have a hover_region", function() {
    expect(map_i_am.hover_region).toBeNull;
  });
});