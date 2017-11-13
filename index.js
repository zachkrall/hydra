const PatchBay = require('./lib/pb-live.js')
const vSynth = require('./lib/v-synth.js')
var ctx
//var pb


function init() {


  var vs = new vSynth({networked: true})
//  const canvasStream = vs.o[0].captureStream()

  //var pbLive = new PatchBay(canvasStream)

  }

  window.onload = init
