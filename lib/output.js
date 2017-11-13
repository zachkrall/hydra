const transforms = {
  color: {
    inputs: [{
      name: 'color',
      type: 'color',
      default: [1.0, 0.5, 0.0, 1.0]
    }],
    fragBody: `
      c = <0>;
    `
  },
gradient: {
  fragBody: `
    c = vec4(st, 0.0, 1.0);
  `
},
repeat: {
  inputs: [
    {
      name: 'repeat',
      type: 'float',
      default: 3.0
    }
  ],
  fragBody: `
    st*= <0>;
    st = fract(st);
    `
},
rotate: {
  inputs: [
    {
      name: 'angle',
      type: 'float',
      default: 10.0
    }
  ],
  fragBody: `
    st -= vec2(0.5);
    st = mat2(cos(<0>),-sin(<0>), sin(<0>),cos(<0>))*st;
    st += vec2(0.5);
  `
}
}

var Output = function (opts) {
  this.regl = opts.regl
  this.init()

}

Object.keys(transforms).forEach((method) => {
  Output.prototype[method] = function (...args) {
  //  console.log("applying", method, transforms[method])
    this.applyTransform(transforms[method], args)

    return this
  }
})


Output.prototype.init = function() {
  this.transformIndex = 0
  this.fragHeader = `
  precision mediump float;

  varying vec2 uv;
  `
  this.fragBody = ``
  //
  // uniform vec4 color;
  // void main () {
  //   gl_FragColor = color;
  // }`
  this.vert = `
  precision mediump float;
  attribute vec2 position;
  varying vec2 uv;

  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position-1.0, 0, 1);
  }`
  this.attributes = {
    position: [
      [-2, 0],
      [0, -2],
      [2, 2]
    ]
  }

  this.uniforms = {
  }
  return this
  // this.color([1, 0, 1, 1]).repeat(4)
   //.rotate().repeat().repeat().rotate().repeat()

  //console.log(this)
//  this.applyTransform(transforms['gradient'])

  // this.applyTransform(repeat)
  // this.applyTransform(rotate)

}

Output.prototype.parse = function(strings, ...values){
  console.log("strings", strings)
  console.log("values", values)
  return 'boo'
}

Output.prototype.applyTransform = function(opts, args) {
  console.log("ARGS", args)
//  console.log("applyingggg", opts, this)
//var test = this.parse`${opts.fragBody}`
//console.log("TEST", test)
if(opts.inputs){
  var uniforms = {}
  opts.inputs.forEach((input, index)=>{
    const uniformName = input.name+this.transformIndex
    uniforms[uniformName] = args[index]? args[index] : input.default
    let header = ``
    if(input.type==='color'){
      header = `uniform vec4 ${uniformName};`
    } else if (input.type==='float'){
      header = `uniform float ${uniformName};`
    }
    this.fragHeader = `
      ${this.fragHeader}
      ${header}
    `
    let replaceString = '<'+index+'>'
    opts.fragBody = opts.fragBody.replace(new RegExp(replaceString, 'g'), uniformName)
  })
  Object.assign(this.uniforms, uniforms)
}
    // if(opts.input){
    //   Object.assign(this.uniforms, opts.uniforms)
    // }
    // if(opts.fragHeader){
    //   this.fragHeader = `
    //     ${this.fragHeader}
    //     ${opts.fragHeader}
    //   `
    // }
    //
    if(opts.fragBody){
      this.fragBody = `
        ${opts.fragBody}
        ${this.fragBody}
      `
    }
    this.transformIndex++
}

Output.prototype.compileFragShader = function() {
  var frag = `
    ${this.fragHeader}

    void main () {
      vec4 c = vec4(0, 0, 0, 0);
      vec2 st = uv;
      ${this.fragBody}
      gl_FragColor = c;
    }
  `
//  console.log("FRAG", frag)
  return frag
}

Output.prototype.render = function () {

//  console.log(this.compileFragShader())
  this.regl({

  // In a draw call, we can pass the shader source code to regl
  frag: this.compileFragShader(),

  vert: this.vert,

  attributes: this.attributes,

  uniforms: this.uniforms,

  count: 3
})()
}


module.exports = Output
