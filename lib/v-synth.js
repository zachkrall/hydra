// syntax
// init sources, 6 sources, default to framebuffer?? or canvas?? other possibilities are html page,
// canvas with somthing else, pass in id of element. if in extension, pass in existing element with id
// s[0].initCam
// s[1].initRemote('sss')
// s[2].initGen('osc')
// s[3].initVid

// output syntax::
// o[0] = blend(o[1], o[2], 'displace')
// o[1] = osc(20).rotate(5).rep(10).pulse(8).noise(40)
// o[2] = modulate(osc(20).rotate(5).rep(10).pulse(8).noise(40), s[2])
//
// how to handle changing over time? possible to set sync? i.e. rotate(5, true) would be moving, no argument would be still?
//
// try - catch for evaluating statements?
//
const Output = require('./output.js')
const loop = require('raf-loop')
const Source = require('./source.js')


var NUM_OUTPUTS = 1
var vSynth = function (opts) {
  var canvas = document.createElement('canvas')
  // var ctx = this.o[0].getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  this.regl = require('regl')(canvas)

  this.o = []
  this.s = []
//  this.o = []
  this.time = 0
  //o[0] = on screen canvas
  // ctx.fillStyle = "rgb("+Math.floor(Math.random()*255) +","+ Math.floor(Math.random()*255)+"," + Math.floor(Math.random()*255) +")"
  // ctx.fillRect(0, 0, this.o[0].width, this.o[0].height)
  document.body.appendChild(canvas)
  //o[1] = if broacast enabled, o[1] is set to broadcast canvas, default is same as o[0]
  // if(opts.networked) {
  //   this.o[1] = this.o[0]
  // }

  //window.vs = this

  // This clears the color buffer to black and the depth buffer to 1
  this.regl.clear({
    color: [0, 0, 0, 1]//,
  //  depth: 1
  })

  // this.s[0] = new Source({regl: this.regl})
  // this.s[0].init('cam')

  for(var i = 0; i < NUM_OUTPUTS; i ++){
    this.o[i] = new Output({regl: this.regl})
    this.o[i].render()
    window['o'+i] = this.o[i]
  }

  var self = this

//  window.s0 = this.s[0]
  var engine = loop(function(dt) {
  //this.regl.frame(function () {
    self.time += dt*0.001
    //console.log(self.time)
    self.regl.clear({
    color: [0, 0, 0, 1]
  })
    for(var i = 0; i < NUM_OUTPUTS; i++){
      self.o[i].tick(self.time)
    }
  }).start()



// })
  //  self.s[0].tick(self.time)
    // delta time in milliseconds
//}).start()

}

module.exports = vSynth
