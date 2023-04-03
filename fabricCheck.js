const fcanvas = new fabric.Canvas(document.querySelector('#fCanvas'), {
  width: 2870,
  height: 2114,
});
fcanvas.loadFromJSON(
  {
    version: '5.2.1',
    objects: [
      {
        type: 'image',
        version: '5.2.1',
        originX: 'left',
        originY: 'top',
        left: 824.4914935976013,
        top: 308.0595448167903,
        width: 3024,
        height: 4032,
        fill: 'rgb(0,0,0)',
        stroke: null,
        strokeWidth: 0,
        strokeDashArray: null,
        strokeLineCap: 'butt',
        strokeDashOffset: 0,
        strokeLineJoin: 'miter',
        strokeUniform: false,
        strokeMiterLimit: 4,
        scaleX: 0.3002159152862739,
        scaleY: 0.3002159152862739,
        angle: 45,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: '',
        fillRule: 'nonzero',
        paintFirst: 'fill',
        globalCompositeOperation: 'source-over',
        skewX: 0,
        skewY: 0,
        cropX: 0,
        cropY: 0,
        name: 'userImage-2-c169afff-9096-47ad-bdd9-c0b9b2b17fd2',
        src: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/a81970e4-514c-442b-8f58-87b5ea809f501873028403530748053.JPG',
        crossOrigin: 'anonymous',
        filters: [],
        userDefined: true,
      },
    ],
    backgroundImage: {
      type: 'image',
      version: '5.2.1',
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      width: 2870,
      height: 2114,
      fill: 'transparent',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      cropX: 0,
      cropY: 0,
      src: 'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Background.png',
      crossOrigin: 'anonymous',
      filters: [],
    },
  },
  () => {
    console.log(fcanvas);
    fcanvas.renderAll.bind(fcanvas);
    if (
      fcanvas.width > fcanvas.height &&
      !document.querySelector('.canvas-container .divider')
    ) {
      const ele = document.createElement('div');
      ele.setAttribute('class', 'divider');
      document.querySelector('.canvas-container').appendChild(ele);
    }
  }
);
