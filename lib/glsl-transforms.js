module.exports = {
  src: {
    transformType: 'color',
    inputs: [{
      name: 'src',
      type: 'image'
    }],
    fragBody: `
      c = texture2D(<0>, vec2(1.0)-st);
    `
  },
  color: {
    transformType: 'color',
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
  transformType: 'color',
  fragBody: `
    c = vec4(st, sin(time), 1.0);
  `
},
repeatX: {
  transformType: 'coord',
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
  transformType: 'coord',
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
  transformType: 'coord',
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
  transformType: 'coord',
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
