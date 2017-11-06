// Module for handling connections to multiple peers

var extend = Object.assign
var PatchBay = require('./rtc-patch-bay.js')
var inherits = require('inherits')


var PBLive = function (stream) {
  this.session = {}

  //nicknames of available streams
  this.available = {}

  //lookup tables for converting id to nickname
  this.nickFromId = {}
  this.idFromNick = {}

  this.loadFromStorage()
  this.init(stream)
}
// inherits from PatchBay module
inherits(PBLive, PatchBay)

PBLive.prototype.init = function(stream){
  this.settings = {
    server: "https://live-lab-v1.glitch.me/",
    room: "patch-bay",
    stream: stream
  }
  if(this.session.id) this.settings.id = this.session.id


  // to do -- destroy existing pb
    PatchBay.call(this, this.settings)
    window.pb = this

    this.on('ready', ()=>{
      if(this.session.nick) {
        this.setName(this.session.nick)
      }
    })
    
    window.onbeforeunload = ()=>{
      this.session.id = window.pb.getLocalId()
      this.session.nick = this.nick
      sessionStorage.setItem("pb", JSON.stringify(this.session))
    }
}

PBLive.prototype.loadFromStorage = function(){
  if (sessionStorage.getItem("pb") !== null) {
    this.session = JSON.parse(sessionStorage.getItem("pb"))
  }
}

PBLive.prototype.initSource = function(nick) {

}

//default nickname is just peer id.
// to do: save nickname information between sessions
PBLive.prototype._newPeer = function (peer){
      this.nickFromId[peer] = peer
      this.idFromNick[peer] = peer
}

PBLive.prototype.list = function(){
  return Object.keys(this.idFromNick)
}

//choose an identifying name
PBLive.prototype.setName = function(nick) {
  this.nick = nick
  document.title = nick
  this.broadcast({
    type: "update-nick",
    id: this._userData.uuid,
    nick: this.nick
  })
}

PBLive.prototype._receivedBroadcast = function(data) {
  if(data.type==='update-nick'){
    delete this.idFromNick[this.nickFromId[data.id]]
    this.nickFromId[data.id] = data.nick
    this.idFromNick[data.nick] = data.id
    console.log(this.list())
  }
}
// PBExtended.prototype.
module.exports = PBLive
