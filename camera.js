const PatchBay = require('./lib/pb-live.js')
const getUserMedia = require('getusermedia')
const enumerateDevices = require('enumerate-devices')


var vidInput
var vidDropdown

window.onload = function(){
  vidDropdown = document.getElementById("deviceSelect")
  var pb = new PatchBay()
  enumerateDevices(function(err, devices) {
    if(err) {
        console.log(err.message); //device enumeration not supported
    } else {
        console.log(devices);
        vidInput = devices.filter(device => device.kind == "videoinput")
        vidInput.forEach((device)=>{
          var option = document.createElement("option");
          option.text = device.label;
          option.value = device.deviceId
          vidDropdown.add(option)
        })

        document.getElementById("init").onmousedown = function() {
          var deviceId = vidDropdown.value
          console.log(deviceId)
          getUserMedia({
            audio: false,
            video: {deviceId:deviceId}
          }, function(err, stream){
            if(err) alert(err)
            document.getElementById("vid").srcObject = stream
            console.log("got stream", stream)
           pb.init(stream)
            var name = document.getElementById("sourceName").value
              console.log(pb, name)
            pb.setName(name)


          //  pb.init(stream)
          })
        }
    }
});

}
