const PatchBay = require('./lib/pb-live.js')
const vSynth = require('./lib/v-synth.js')
const Editor = require('./lib/editor.js')

var ctx

//var pb


function init() {
  //console.log("loaded", document.getElementById('code'))

  var vs = new vSynth({networked: true})
  var editor = new Editor()
  editor.eval()
//  const canvasStream = vs.o[0].captureStream()

//  var pbLive = new PatchBay(canvasStream)

  }

  window.onload = init
