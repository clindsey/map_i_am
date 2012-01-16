Harness = class
  slice: Array.prototype.slice
  constructor: (methods) ->
    @calls = []
    for method in methods.split /\s+/
      ((method) =>
        @[method] = =>
          @calls.push
            method: method
            args: @slice.call arguments
      )(method)

window.Stage = class extends Harness
  constructor: ->
    super "update enableMouseOver removeAllChildren"
    @canvas = {}
    @children = []
  addChild: (display_object) ->
    @children.push display_object

EaselGraphics = class extends Harness
  constructor: ->
    super "beginFill endFill beginStroke endStroke moveTo lineTo setStrokeStyle clear"

window.Rectangle = class

window.Graphics = class extends EaselGraphics

window.Shape = class
  constructor: ->
    @graphics = new window.Graphics()
