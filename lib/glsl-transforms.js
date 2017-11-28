module.exports = {
  src: {
    transformType: 'color',
    inputs: [{
      name: 'src',
      type: 'image'
    }],
    fragBody: `
      c = texture2D(<0>, st);
    `
  },
  mult: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      }
    ],
    fragBody: `
      c *= texture2D(<0>, uv);
    `
  },
  add: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      }
    ],
    fragBody: `
      c += texture2D(<0>, uv);
    `
  },
  diff: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      }
    ],
    fragBody: `
      c -= texture2D(<0>, uv);
      c = vec4(abs(c).xyz, 1.0);
    `
  },
  pixelate: {
    transformType: 'coord',
    inputs: [
      {
        name: 'pixelX',
        type: 'float',
        default: 20
      }, {
        name: 'pixelY',
        type: 'float',
        default: 20
      }
    ],
    fragBody: `
      st *= vec2(<0>, <1>);
      st = floor(st) + 0.5;
      st /= vec2(<0>, <1>);
    `
  },
  contrast: {
    transformType: 'color',
    inputs: [
      {
        name: 'contrast',
        type: 'float',
        default: 1.6
      }
    ],
    fragBody: `
      c = (c-vec4(0.5))*<0> + vec4(0.5);
      c = vec4(c.xyz, 1.0);
    `
  },
  kaleid: {
    transformType: 'coord',
    inputs: [
      {
        name: 'nSides',
        type: 'float',
        default: 4.0
      }
    ],
    fragBody: `
      st -= 0.5;
      float r<0> = length(st);
      float a<0> = atan(st.y, st.x);
      float pi<0> = 2.*3.1416;
      a<0> = mod(a<0>, pi<0>/<0>);
      a<0> = abs(a<0>-pi<0>/<0>/2.);
      st = r<0>*vec2(cos(a<0>), sin(a<0>));
    `
  },
  brightness: {
    transformType: 'color',
    inputs: [
      {
        name: 'brightness',
        type: 'float',
        default: 0.4
      }
    ],
    fragBody: `
      c = vec4(c.xyz + vec3(<0>), 1.0);
    `
  },
  posterize: {
    transformType: 'color',
    inputs: [
      {
        name: 'bins',
        type: 'float',
        default: 3.0
      },
      {
        name: 'gamma',
        type: 'float',
        default: 0.6
      }
    ],
    fragBody: `
      c = pow(c, vec4(<1>));
      c*=vec4(<0>);
      c = floor(c);
      c/=vec4(<0>);
      c = pow(c, vec4(1.0/<1>));
      c = vec4(c.xyz, 1.0);
    `
  },
  modulate: {
    transformType: 'coord',
    inputs: [
      {
        name: 'src',
        type: 'image'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.1
      }
    ],
    fragBody: `
      st += texture2D(<0>, uv).xy*<1>;
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
