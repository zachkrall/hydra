//require('codemirror/mode/javascript/javascript')
//var CodeMirror = require('codemirror/lib/codemirror')

var EditorClass = function () {
var l = document.getElementById("code")
  var self = this
  this.cm = CodeMirror.fromTextArea(document.getElementById("code"),{
    theme: 'tomorrow-night-eighties',
    value: "hello",
     mode:  "javascript",
     lineWrapping: true,
     extraKeys: {
       "Ctrl-S": function(instance) { console.log("control s") },
       "Ctrl-Shift-Enter": function(instance){
         var c = instance.getCursor();
         var s = instance.getLine(c.line)
         console.log(s)
         eval(s)
       },
       "Ctrl-Enter": function(instance) {
         self.eval()
       }
     }
  });

  this.cm.setValue("o0.clear().gradient().repeat(40, 2).rotate(0.4)")
  this.cm.markText({line: 0, ch: 0}, {line: 6, ch: 42}, {className: "styled-background"});
  this.cm.refresh()
//console.log("code mirror", myCodeMirror)

//   (document.body, {
//   value: "function myScript(){return 100;}\n",
//   mode:  "javascript"
// });
//  editor.refresh()
}

EditorClass.prototype.eval = function(arg){
  var jsString
  if(arg){
    jsString = arg
  } else {
    jsString = this.cm.getValue()
  }
  try {
    eval(jsString)
  } catch(e){
    console.log("ERROR", JSON.stringify(e))
  }
}
module.exports = EditorClass
