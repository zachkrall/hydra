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
    c = vec4(st, sin(time), 1.0);
  `
},
repeatX: {
  inputs: [
    {
      name: 'repeatX',
      type: 'float',
      default: 3.0
    },{
      name: 'offsetX',
      type: 'float',
      default: 0.0
    }
  ],
  fragBody: `
    st*= vec2(<0>, 1.0);
    st.x += step(1., mod(st.y,2.0)) * <1>;
    st = fract(st);
    `
},
repeatY: {
  inputs: [
    {
      name: 'repeatY',
      type: 'float',
      default: 3.0
    },{
      name: 'offsetY',
      type: 'float',
      default: 0.0
    }
  ],
  fragBody: `
    st*= vec2(1.0, <0>);
    st.y += step(1., mod(st.x,2.0)) * <1>;
    st = fract(st);
    `
},
repeat: {
  inputs: [
    {
      name: 'repeatX',
      type: 'float',
      default: 3.0
    },
    {
      name: 'repeatY',
      type: 'float',
      default: 3.0
    },
    {
      name: 'offsetX',
      type: 'float',
      default: 0.0
    },
    {
      name: 'offsetY',
      type: 'float',
      default: 0.0
    }
  ],
  fragBody: `
    st*= vec2(<0>, <1>);
    st.x += step(1., mod(st.y,2.0)) * <2>;
    st.y += step(1., mod(st.x,2.0)) * <3>;
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
    st = mat2(cos(<0>*time),-sin(<0>*time), sin(<0>*time),cos(<0>*time))*st;
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

  uniform float time;
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
    time: this.regl.prop('time')
  }

  this.compileFragShader()
  return this
  // this.color([1, 0, 1, 1]).repeat(4)
   //.rotate().repeat().repeat().rotate().repeat()

  //console.log(this)
//  this.applyTransform(transforms['gradient'])

  // this.applyTransform(repeat)
  // this.applyTransform(rotate)

}

// Output.prototype.parse = function(strings, ...values){
//   console.log("strings", strings)
//   console.log("values", values)
//   return 'boo'
// }

Output.prototype.applyTransform = function(opts, args) {
  //console.log("ARGS", args)
//  console.log("applyingggg", opts, this)
//var test = this.parse`${opts.fragBody}`
//console.log("TEST", test)
var fragAddition = opts.fragBody
if(opts.inputs){
  var uniforms = {}
  //for each input on a given transform, add variable to shader header and add to body

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
    console.log("adding ", replaceString, uniformName, fragAddition)

    fragAddition = fragAddition.replace(new RegExp(replaceString, 'g'), uniformName)
    console.log("adding ", uniformName, fragAddition)
  })
  Object.assign(this.uniforms, uniforms)

}
if(opts.fragBody){
  this.fragBody = `
    ${fragAddition}
    ${this.fragBody}
  `
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

    this.transformIndex++
    this.compileFragShader()
    this.render()
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
  this.frag = frag
}

Output.prototype.render = function () {

  this.reglParams = {

  // In a draw call, we can pass the shader source code to regl
  frag: this.frag,

  vert: this.vert,

  attributes: this.attributes,

  uniforms: this.uniforms,

  count: 3
}
//  console.log(this.compileFragShader())
  //this.tick()
}

Output.prototype.tick = function(time){
//  console.log(time)
  this.regl(this.reglParams)({
    time: time
  })
}


module.exports = Output
