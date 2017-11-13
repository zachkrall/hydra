// Extends rtc-patch-bay to include support for nicknames and persistent session storage

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
    //received a broadcast
    this.on('broadcast', this._processBroadcast.bind(this))

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
  this.initConnectionFromId(this.idFromNick[nick])
}

//default nickname is just peer id.
// to do: save nickname information between sessions
PBLive.prototype._newPeer = function (peer){
  //console.log("new peer", peer)
    this.nickFromId[peer] = peer
    this.idFromNick[peer] = peer

    //to do: only send to new peer, not to all
    if(this.nick){
      this.broadcast({
        type: "update-nick",
        id: this._userData.uuid,
        nick: this.nick
      })
    }
}

PBLive.prototype.list = function(){
  return Object.keys(this.idFromNick)
}

//choose an identifying name
PBLive.prototype.setName = function(nick) {

  this.broadcast({
    type: "update-nick",
    id: this._userData.uuid,
    nick: nick,
    previous: this.nick
  })
  this.nick = nick
  document.title = nick
}

PBLive.prototype._processBroadcast = function(data) {
  if(data.type==='update-nick'){
    if(data.previous !== data.nick){
      delete this.idFromNick[this.nickFromId[data.id]]
      this.nickFromId[data.id] = data.nick
      this.idFromNick[data.nick] = data.id
      if(data.previous){
        console.log(data.previous  + " changed to " + data.nick)
      } else {
        console.log("connected to " + data.nick)
      }
    }
  }
}
// PBExtended.prototype.
module.exports = PBLive
