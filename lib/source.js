const Webcam = require('./webcam.js')

var Source = function (opts) {
  this.regl = opts.regl
  this.video = null
  this.tex = this.regl.texture()
}

Source.prototype.init = function(type) {
  if(type==='cam'){
    const self = this
    Webcam().then(function(response) {
      self.video = response.video
      self.tex = self.regl.texture(self.video)
      console.log("received camera input", self)
    })
  }
}

Source.prototype.tick = function(t){
  if(this.video !== null){
    this.tex.subimage(this.video)
  }
}

Source.prototype.getTexture = function(){
  return this.tex
}

module.exports = Source
