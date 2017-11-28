const PatchBay = require('./lib/pb-live.js')
const vSynth = require('./lib/v-synth.js')
const Editor = require('./lib/editor.js')

var ctx

//var pb


function init() {
  //console.log("loaded", document.getElementById('code'))
//
  var vs = new vSynth({networked: true})
  var editor = new Editor()
  editor.eval()
//  const canvasStream = vs.o[0].captureStream()
  var localStream = vs.canvas.captureStream()
//  setTimeout(function(){
  var pbLive = new PatchBay(localStream)
  pbLive.on('stream', function(id, stream){
    console.log("got stream!")
    vs.addStreamSource(stream)
  })


  // var testCanvas = document.createElement('canvas')
  //   // var ctx = this.o[0].getContext('2d')
  //   testCanvas.width = 400
  //   testCanvas.height = 300
  //
  //   var ctx = testCanvas.getContext('2d')
  //   ctx.fillStyle="#FFFF00";
  // ctx.fillRect(20,20,150,100);
  //   ctx.moveTo(0,0);
  // ctx.lineTo(200,100);
  // ctx.stroke();
  //
  // document.body.appendChild(testCanvas)
  //document.body.appendChild(testCanvas)
  //var localStream = testCanvas.captureStream()
  // console.log("CAPTURING", localStream)
  //   const video = document.createElement('video')
  //   //video.src = URL.createObjectURL(localStream)
  //   video.srcObject = localStream
  // //  console.log("CAPTURE STREAM", localStream)
  //   //   video.play()
  //   // })
  //   document.body.appendChild(video)


}
  window.onload = init
