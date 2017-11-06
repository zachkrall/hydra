const PatchBay = require('./lib/pb-live.js')
var ctx
//var pb


function init() {
  const canvas = document.createElement('canvas')
  ctx = canvas.getContext('2d')
  canvas.width = 400
  canvas.height = 300
  ctx.fillStyle = "rgb("+Math.floor(Math.random()*255) +","+ Math.floor(Math.random()*255)+"," + Math.floor(Math.random()*255) +")"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  document.body.appendChild(canvas)

  const canvasStream = canvas.captureStream()

  var pbLive = new PatchBay(canvasStream)

  }

  window.onload = init
