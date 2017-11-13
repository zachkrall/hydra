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

var o = document.createElement('canvas')
// var ctx = this.o[0].getContext('2d')
o.width = 400
o.height = 300
var regl = require('regl')(o)

var vSynth = function (opts) {
  this.s = []
  this.o = []

  //o[0] = on screen canvas
  // ctx.fillStyle = "rgb("+Math.floor(Math.random()*255) +","+ Math.floor(Math.random()*255)+"," + Math.floor(Math.random()*255) +")"
  // ctx.fillRect(0, 0, this.o[0].width, this.o[0].height)
  document.body.appendChild(o)
  //o[1] = if broacast enabled, o[1] is set to broadcast canvas, default is same as o[0]
  // if(opts.networked) {
  //   this.o[1] = this.o[0]
  // }

  window.vs = this

  // This clears the color buffer to black and the depth buffer to 1
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  this.o[0] = new Output({regl: regl})

  this.o[0].render()
}

module.exports = vSynth
