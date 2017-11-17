//require('codemirror/mode/javascript/javascript')
//var CodeMirror = require('codemirror/lib/codemirror')

var EditorClass = function () {
var l = document.getElementById("code")

  var cm = CodeMirror.fromTextArea(document.getElementById("code"),{
    theme: 'tomorrow-night-eighties',
    value: "hello",
     mode:  "javascript",
     lineWrapping: true,
     extraKeys: {
       "Ctrl-S": function(instance) { console.log("control s") },
       "Ctrl-Enter": function(instance) {
         var c = instance.getCursor();

         var s = instance.getLine(c.line)
         console.log(s)
         eval(s)
       }
     }
  });

  cm.setValue("o0.init().gradient().repeat(4, 2).rotate(0.4)")
  cm.markText({line: 0, ch: 0}, {line: 6, ch: 42}, {className: "styled-background"});
  cm.refresh()
//console.log("code mirror", myCodeMirror)

//   (document.body, {
//   value: "function myScript(){return 100;}\n",
//   mode:  "javascript"
// });
//  editor.refresh()
}

module.exports = EditorClass
