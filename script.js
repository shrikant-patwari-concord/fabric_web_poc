const configStore = (function () {
  // general default stuff that will help us set some options
  var spacingUnit = 20; // this is the old textPadding

  var defaultFont = 'fontid-107'; // Annette Print ("Hey sunshine")
  var piBy2 = Math.PI * 2;

  return {
    spacingUnit: spacingUnit,
    // the defaults are used on front and back of the cards
    textDefaultSettings: {
      name: 'userText',
      fontFamily: defaultFont,
      // positioning and dimensions
      textAlign: 'left',
      left: spacingUnit * 4,
      top: spacingUnit * 4,
      padding: 0.75 * spacingUnit,
      // miscellaneous settingsuser
      editable: false,
      selectable: true,
      fill: '#74717E',
      cursorColor: '#74717E',
    },
    // defaults for editable texts
    editableTextDefaultSettings: {
      name: 'editableText',
      backgroundColor: 'rgba(237, 141, 56, 0.2)',
      editableText: true,
      editable: false,
      isModified: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'pointer',
      padding: 5,
      selectable: true,
      selectionColor: 'rgba(237, 141, 56, 0.2)',
    },
    // defaults for editable areas
    editableAreaDefaultSettings: {
      name: 'editableArea',
      stroke: '#ED8D38',
      strokeWidth: 4,
      strokeDashArray: [12, 18],
      strokeLineCap: 'round',
      fill: 'rgba(237, 141, 56, 0.2)',
      isModified: false,
      selectable: false,
      eventable: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      hoverCursor: 'default',
    },
    // editable area action buttons background & shape
    editableAreaButtonBackground: {
      radius: 65,
      fill: '#562B9D',
      originX: 'top',
      originY: 'left',
      selectable: false,
      eventable: false,
    },
    // editable area button with icon group settings
    editableAreaButtonGroupDefault: {
      name: 'areaButton',
      selectable: false,
      eventable: true,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      originX: 'center',
      originY: 'center',
      hoverCursor: 'pointer',
    },
    // editable area button group text (action button text)
    editableAreaButtonTextDefault: {
      name: 'areaText',
      textAlign: 'center',
      fontSize: 28,
      fontFamily: 'Poppins',
      fill: '#562B9D',
      opacity: 0.6,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      selectable: false,
      eventable: false,
      originX: 'center',
      originY: 'center',
      hoverCursor: 'default',
    },
    // editable area explanation text settings
    editableAreaExplanationDefault: {
      name: 'areaInfo',
      textAlign: 'center',
      fontSize: 32,
      fontFamily: 'Poppins',
      fill: '#562B9D',
      selectable: false,
      eventable: false,
      originX: 'center',
      originY: 'top',
      hoverCursor: 'default',
    },
    // the defaults for the placeholders
    placeholderDefaultSettings: {
      name: 'placeholder',
      fontFamily: defaultFont,
      // positioning and dimensions
      left: spacingUnit * 4,
      padding: 0.75 * spacingUnit,
      // miscellaneous settings
      editable: true,
      fill: '#74717E',
      opacity: 1,
    },
    // default scaling for images and decorations
    defaultImageScale: 1 / 4,
    defaultDecorationScale: 1 / 6,
    rectFillColor: '#838684',
    imageDefaultSettings: {
      originX: 'center',
      originY: 'center',
      crossOrigin: 'anonymous',
    },
    // the defaults for photozone placement
    photozoneDefaultSettings: {
      name: 'photozone',
      originX: 'left',
      originY: 'top',
      fill: 'transparent',
      hoverCursor: 'pointer',
      strokeWidth: 0,
      selectable: false,
      evented: true,
      lockMovementX: true,
      lockMovementY: true,
      hasImg: false,
    },
    // the defaults for images added on photozones
    imagePhotozoneDefaultSettings: {
      name: 'userUploadedImage',
      userUploaded: true,
      selectable: false,
      evented: false,
      lockScalingFlip: true,
      angle: 0,
    },
    // the defaults for the overlay images used on photocards (the photoframe)
    overlayImageDefaultSettings: {
      name: 'overlayImg',
      evented: false,
      selectable: false,
    },
    cos: function (angle) {
      if (angle === 0) {
        return 1;
      }
      if (angle < 0) {
        // cos(a) = cos(-a)
        angle = -angle;
      }
      var angleSlice = angle / piBy2;
      switch (angleSlice) {
        case 1:
        case 3:
          return 0;
        case 2:
          return -1;
      }
      return Math.cos(angle);
    },
    /**
     * Calculate the sin of an angle, avoiding returning floats for known results
     * @static
     * @memberOf fabric.util
     * @param {Number} angle the angle in radians or in degree
     * @return {Number}
     */
    sin: function (angle) {
      if (angle === 0) {
        return 0;
      }
      var angleSlice = angle / piBy2,
        sign = 1;
      if (angle < 0) {
        // sin(-a) = -sin(a)
        sign = -1;
      }
      switch (angleSlice) {
        case 1:
          return sign;
        case 2:
          return 0;
        case 3:
          return -sign;
      }
      return Math.sin(angle);
    },
  };
})();

const radToDegree = function (angle) {
  return (angle || 0) * 57.2958;
};

let loadLayer = async (layer, faceNumber, preview) => {
  let { backgroundUrl, frameUrl } = layer;

  let canvasJson = {
    version: '3.6.6',
    objects: [],
    backgroundImage: {
      type: 'image',
      version: '3.6.6',
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      width: layer.dimensions.width,
      height: layer.dimensions.height,
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
      lockScalingFlip: false,
      selectable: true,
      lockMovementX: false,
      lockMovementY: false,
      cornerColor: 'rgb(178,204,255)',
      borderDashArray: null,
      evented: true,
      hoverCursor: null,
      lockRotation: false,
      src: backgroundUrl,
      crossOrigin: 'anonymous',
      filters: [],
    },
    selectionColor: 'rgba(100, 100, 255, 0.3)',
    hoverCursor: 'move',
  };

  const userImages = [];
  await Promise.all(
    layer.photoZones.map((d) => {
      d.image.imageId && userImages.push(d.image.imageId);
      let scaleX = d.image.scale,
        scaleY = d.image.scale,
        left = (d.image.insideWidth || 0) + d.left || 0,
        top = d.top || 0;
      if (typeof d.userDefined === 'undefined') {
        const canvasWidth = d.width || layer.dimensions.width,
          canvasHeight = d.height || layer.dimensions.height,
          isCustomWidthDefined = d.width ? true : false,
          isCustomHeightDefined = d.height ? true : false;

        if (d.image.width * scaleX > d.image.height * scaleY) {
          scaleX = scaleY = canvasHeight / (d.image.height * scaleY);
        }
        if (d.image.width * scaleX < d.image.height * scaleY) {
          scaleX = scaleY = canvasWidth / (d.image.width * scaleX);
        }
        if (d.image.width * scaleX < canvasWidth) {
          scaleX = scaleY = canvasWidth / (d.image.width * scaleX);
        }
        if (d.image.height * scaleY < canvasHeight) {
          scaleX = scaleY = canvasHeight / (d.image.height * scaleY);
        }

        if (isCustomWidthDefined && isCustomHeightDefined) {
          if (d.image.width * scaleX > canvasWidth) {
            left = left - (d.image.width * scaleX - canvasWidth) / 2;
          } else {
            top = top - (d.image.height * scaleY - canvasHeight) / 2;
          }
        } else {
          left = (canvasWidth - d.image.width * scaleX) / 2;
          top = (canvasHeight - d.image.height * scaleY) / 2;
        }
      }
      let point = {
        x: left,
        y: top,
      };
      if (d.image.angle) {
        const a = d.image.angle;
        const t = [
          configStore.cos(a),
          configStore.sin(a),
          -configStore.sin(a),
          configStore.cos(a),
          0,
          0,
        ];
        point = {
          x: t[0] * point.x + t[2] * point.y + t[4],
          y: t[1] * point.x + t[3] * point.y + t[5],
        };
      }
      canvasJson.objects.push({
        type: 'image',
        version: '3.6.6',
        left: point.x,
        top: point.y,
        scaleX: scaleX || 1,
        scaleY: scaleY || 1,
        userAddedPhotoId: d.image.imageId,
        angle: radToDegree(d.image.angle),
        originX: 'left',
        originY: 'top',
        centeredRotation: true,
        width: d.image.width,
        height: d.image.height,
        fill: 'rgb(0,0,0)',
        stroke: null,
        strokeWidth: 0,
        strokeDashArray: null,
        strokeLineCap: 'butt',
        strokeDashOffset: 0,
        strokeLineJoin: 'miter',
        strokeUniform: false,
        strokeMiterLimit: 4,
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
        name: 'userUploadedImage',
        userUploaded: true,
        selectable: false,
        evented: false,
        lockScalingFlip: true,
        src: d.image.uri,
        crossOrigin: 'anonymous',
        filters: [],
        clipPath:
          typeof d.userDefined === 'undefined'
            ? {
                type: 'rect',
                version: '3.6.6',
                left: d.left || 0,
                top: d.top || 0,
                width: d.width || layer.dimensions.width,
                height: d.height || layer.dimensions.height,
                angle: radToDegree(d.angle),
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 1,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
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
                rx: 0,
                ry: 0,
                inverted: false,
                absolutePositioned: true,
              }
            : undefined,
      });
    })
  );

  layer.photoZones.forEach((d) => {
    if (typeof d.userDefined === 'undefined') {
      canvasJson.objects.push(
        Object.assign({}, configStore.photozoneDefaultSettings, {
          type: 'rect',
          version: '3.6.6',
          left: d.left || 0,
          top: d.top || 0,
          width: d.width || layer.dimensions.width,
          height: d.height || layer.dimensions.height,
          angle: radToDegree(d.angle),
          fill: 'transparent',
          stroke: null,
          strokeWidth: 1,
          strokeDashArray: null,
          strokeLineCap: 'butt',
          strokeDashOffset: 0,
          strokeLineJoin: 'miter',
          strokeUniform: false,
          strokeMiterLimit: 4,
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
          rx: 0,
          ry: 0,
          inverted: false,
        })
      );
    }
  });

  if (frameUrl) {
    canvasJson.objects.push(
      Object.assign({}, configStore.overlayImageDefaultSettings, {
        type: 'image',
        version: '3.6.6',
        left: 0,
        top: 0,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        originX: 'left',
        originY: 'top',
        width: layer.dimensions.width,
        height: layer.dimensions.height,
        fill: 'transparent',
        stroke: null,
        strokeWidth: 0,
        strokeDashArray: null,
        strokeLineCap: 'butt',
        strokeDashOffset: 0,
        strokeLineJoin: 'miter',
        strokeUniform: false,
        strokeMiterLimit: 4,
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
        selectable: false,
        evented: false,
        lockScalingFlip: true,
        src: frameUrl,
        crossOrigin: 'anonymous',
        filters: [],
      })
    );
  }

  layer.texts.forEach((d) => {
    canvasJson.objects.push(
      Object.assign({}, configStore.textDefaultSettings, {
        type: 'textbox',
        version: '3.6.6',
        originX: 'left',
        originY: 'center',
        left: d.left || 0,
        top: d.top || 0,
        width: d.width,
        height: d.height,
        fill: d.textColor,
        stroke: null,
        strokeWidth: 1,
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
        backgroundColor: 'transparent',
        fillRule: 'nonzero',
        paintFirst: 'fill',
        globalCompositeOperation: 'source-over',
        skewX: 0,
        skewY: 0,
        fontFamily: 'Times New Roman' || `fontid-${d.fontId}`,
        fontWeight: 'normal',
        fontSize: d.fontSize * 4,
        text: d.text,
        underline: false,
        overline: false,
        linethrough: false,
        textAlign: d.textAlign,
        fontStyle: 'normal',
        lineHeight: 1.16,
        textBackgroundColor: '',
        charSpacing: 0,
        styles: {},
        direction: 'ltr',
        path: null,
        pathStartOffset: 0,
        pathSide: 'left',
        pathAlign: 'baseline',
        minWidth: 20,
        splitByGrapheme: false,
      })
    );
  });

  return {
    CanvasJson: canvasJson,
    PrintJson: canvasJson,
    UserImages: userImages,
    FaceId: faceNumber,
    FaceNumber: faceNumber,
  };
};

const jsonData = {
  project_id: '13e7c8ba-3614-4083-be72-d7e3b4a53af3',
  account_id: '2125448473',
  name: 'test',
  product_id: '2PGM1207',
  scan_code: '0002385818',
  version: 1,
  is_digital_fulfillment: false,
  expiration_date: '2023-03-10T13:41:54.826991043Z',
  project_type_code: 'P',
  project_status_code: 'C',
  created_at: '2023-03-03T13:41:54.827024535Z',
  last_updated_at: '2023-03-03T13:41:54.827025507Z',
  font_collection: {
    default_size: 55,
    default_color: '#000000',
    fonts: [
      {
        id: 101,
        name: 'Simply Yours',
        url: 'https://content.dev.hallmark.com/POD_Fonts/108317.ttf',
      },
      {
        id: 102,
        name: 'Grateful for You',
        url: 'https://content.dev.hallmark.com/POD_Fonts/126056.ttf',
      },
      {
        id: 103,
        name: 'Warmest Wishes',
        url: 'https://content.dev.hallmark.com/POD_Fonts/BerdingScript.ttf',
      },
      {
        id: 104,
        name: 'Yours Always',
        url: 'https://content.dev.hallmark.com/POD_Fonts/TuesdayHMK-MGE.ttf',
      },
      {
        id: 105,
        name: 'All My Best',
        url: 'https://content.dev.hallmark.com/POD_Fonts/KrickHMK-Regular.ttf',
      },
      {
        id: 106,
        name: 'Take It Easy',
        url: 'https://content.dev.hallmark.com/POD_Fonts/JohnsonBallpointPen.ttf',
      },
      {
        id: 107,
        name: 'Hey Sunshine',
        url: 'https://content.dev.hallmark.com/POD_Fonts/AnnettePrintMGE-Regular.ttf',
      },
      {
        id: 108,
        name: 'Stay Strong',
        url: 'https://content.dev.hallmark.com/POD_Fonts/JasonPrint.ttf',
      },
      {
        id: 109,
        name: "'Til Next Time",
        url: 'https://content.dev.hallmark.com/POD_Fonts/126059.ttf',
      },
      {
        id: 110,
        name: 'Catch You Later',
        url: 'https://content.dev.hallmark.com/POD_Fonts/JohnsonPrint.ttf',
      },
      {
        id: 111,
        name: 'Keep in Touch',
        url: 'https://content.dev.hallmark.com/POD_Fonts/JenniferPrintLight.ttf',
      },
      {
        id: 112,
        name: 'Hugs to You',
        url: 'https://content.dev.hallmark.com/POD_Fonts/BrentPrint.ttf',
      },
      {
        id: 113,
        name: 'Kind Regards',
        url: 'https://content.dev.hallmark.com/POD_Fonts/TypewriteWornOneHMK.ttf',
      },
      {
        id: 114,
        name: 'Buh-Bye',
        url: 'https://content.dev.hallmark.com/POD_Fonts/AmbergerSansTextA.ttf',
      },
      {
        id: 115,
        name: 'Cheers to You',
        url: 'https://content.dev.hallmark.com/POD_Fonts/BeamNewHMK-Regular.ttf',
      },
      {
        id: 116,
        name: 'Later Gator',
        url: 'https://content.dev.hallmark.com/POD_Fonts/CrayottBookKB.ttf',
      },
      {
        id: 117,
        name: 'WHAT’S UP',
        url: 'https://content.dev.hallmark.com/POD_Fonts/AlmondMilkHMK-Regular.ttf',
      },
      {
        id: 119,
        name: 'Just Saying',
        url: 'https://content.dev.hallmark.com/POD_Fonts/SarahndipityHMK-Smooth.ttf',
      },
      {
        id: 120,
        name: 'OMG Hi',
        url: 'https://content.dev.hallmark.com/POD_Fonts/BeamNewHMK-Bold.ttf',
      },
      {
        id: 121,
        name: "How Ya Doin'",
        url: 'https://content.dev.hallmark.com/POD_Fonts/HelloOne-HMK.ttf',
      },
      {
        id: 122,
        name: 'Just a Note',
        url: 'https://content.dev.hallmark.com/POD_Fonts/AstaSlabHMK-Medium.ttf',
      },
      {
        id: 123,
        name: 'Keep Smiling',
        url: 'https://content.dev.hallmark.com/POD_Fonts/MiziletteHMK-SemiBoldUpright.ttf',
      },
      {
        id: 124,
        name: 'Sincerely',
        url: 'https://content.dev.hallmark.com/POD_Fonts/QueensHatHMK-Italic.ttf',
      },
      {
        id: 125,
        name: 'Hiya Pal',
        url: 'https://content.dev.hallmark.com/POD_Fonts/MichaelaVFHMK.ttf',
      },
      {
        id: 126,
        name: 'Be Seeing You',
        url: 'https://content.dev.hallmark.com/POD_Fonts/FieldnotesHMK-Rough.ttf',
      },
      {
        id: 127,
        name: 'Good Vibes',
        url: 'https://content.dev.hallmark.com/POD_Fonts/GretaHMK-Regular.ttf',
      },
      {
        id: 128,
        name: 'Best Wishes',
        url: 'https://content.dev.hallmark.com/POD_Fonts/BernhardFashionOnePKA.ttf',
      },
      {
        id: 129,
        name: 'Hang Loose',
        url: 'https://content.dev.hallmark.com/POD_Fonts/RittenPrintLowRiseHMK-Regular.ttf',
      },
      {
        id: 130,
        name: 'Much Appreciated',
        url: 'https://content.dev.hallmark.com/POD_Fonts/BethelHMK-Regular.ttf',
      },
    ],
  },
  product: {
    product_id: '2PGM1207',
    template_id: 'PGM1207',
    product_name: 'Personalized Full Photo Birthday Photo Card, 5x7 Vertical',
    vendor_lead_time: 1,
    envelope_color: '#FFFFF',
  },
  fulfillment: {},
  variables: {
    template_data: {
      cardFormat: 'portrait',
      cardSize: '49',
      cardType: 'photo',
      dimensions: {
        height: 179,
        width: 125,
      },
      faces: [
        {
          backgroundUrl:
            'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Background.png',
          canvasJson: null,
          dimensions: {
            height: 2114,
            width: 1476,
          },
          editableAreas: [],
          faceId: 1,
          frameUrl:
            'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Frame.png',
          isEditable: true,
          overlayBackgroundUrl: '',
          photoZones: [
            {
              height: 1951.7098,
              left: 21.259802,
              angle: 0,
              top: 45.70975,
              width: 1363.6118,
              image: {
                playableDuration: null,
                height: 4032,
                width: 3024,
                filename: 'IMG_5345.JPG',
                extension: 'jpg',
                fileSize: 2110350,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/44e462fa-b215-48eb-bb63-d44c4153f1a3198614094973075395.JPG',
                type: 'image',
                translateX: 182.33334350585938,
                localUrl: 'ph://F0CB0481-DF03-4CB1-BA18-CE04B49722B3/L0/001',
                imageId: '8d55aaa6-48f6-41eb-8511-79f73095991f',
                photoTrayId: 'd4f9102e-1953-4bd6-a90e-f98901fcd1c3',
                sliderIndex: 0,
                scaleX: 0.6357615894039735,
                scaleY: 0.6357615894039735,
                scale: 1,
                angle: 1.6580627893946132,
              },
            },
          ],
          previewUrl:
            'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Preview.png',
          replaceBackgroundUrl: '',
          texts: [
            {
              fontFamily: 'OMG Hi',
              fontId: 120,
              fontSize: 26,
              height: 184.72404,
              isFixed: true,
              isHybrid: false,
              isMultiline: false,
              left: 170.5662,
              angle: 0,
              text: 'RYLEIGH',
              textAlign: 'center',
              textColor: '#FFFFFF',
              top: 1693.4612,
              width: 1063.9987,
            },
          ],
          type: 'front',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Background.png',
          canvasJson: null,
          dimensions: {
            height: 2114,
            width: 2870,
          },
          editableAreas: [],
          faceId: 2,
          frameUrl: '',
          isEditable: true,
          overlayBackgroundUrl: '',
          photoZones: [
            {
              left: 40.99995422363281,
              top: 36.66668701171875,
              image: {
                playableDuration: null,
                height: 4032,
                width: 3024,
                filename: 'IMG_5345.JPG',
                extension: 'jpg',
                fileSize: 2110350,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/f00ab951-6feb-4f88-aa98-3a84f2aca6378982474844503167665.JPG',
                type: 'image',
                translateX: 182.33334350585938,
                localUrl: 'ph://F0CB0481-DF03-4CB1-BA18-CE04B49722B3/L0/001',
                imageId: 'a82ae146-ada6-40d0-b22b-160c7e3b0e9d',
                photoTrayId: 'a655bda0-d77f-47e5-953e-d5af097140b0',
                sliderIndex: 1,
                scaleX: 0.46799120366178604,
                scaleY: 0.46799120366178604,
                scale: 0.3335714315934751 / 3,
                insideWidth: 0,
                angle: 0,
              },
              userDefined: true,
            },
            {
              left: 82.33334350585938,
              top: 128.00001017252603,
              image: {
                playableDuration: null,
                height: 4032,
                width: 3024,
                filename: 'IMG_5347.JPG',
                extension: 'jpg',
                fileSize: 2456630,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/7a14ca8f-0760-4698-89b5-0c4320008a531960528713598030433.JPG',
                type: 'image',
                translateX: 182.33334350585938,
                localUrl: 'ph://6A798E40-E215-42B6-9C37-25A3E05AA759/L0/001',
                imageId: 'cb5e36bc-43fb-462c-aaaf-f318619999c7',
                photoTrayId: '0e16a477-6715-46f5-8dd0-687bda84c924',
                sliderIndex: 2,
                scaleX: 0.6467990496300704,
                scaleY: 0.6467990496300704,
                scale: 0.3335714315934751 / 3,
                insideWidth: 1435,
                angle: -0.5410520681182421,
              },
              userDefined: true,
            },
          ],
          previewUrl:
            'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Preview.png',
          replaceBackgroundUrl: '',
          texts: [
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 311.47611254366086,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 1439.2237090846681,
              angle: 0,
              text: 'Add your text here dhdjjd',
              textAlign: 'left',
              textColor: '#595959',
              top: 1119.7662661246604,
              width: 961.5235484554499,
              userDefined: true,
              sliderIndex: 2,
            },
          ],
          type: 'inside',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Background.png',
          canvasJson: null,
          dimensions: {
            height: 2114,
            width: 1394,
          },
          editableAreas: [],
          faceId: 3,
          frameUrl: '',
          isEditable: false,
          overlayBackgroundUrl: '',
          photoZones: [],
          previewUrl:
            'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Preview.png',
          replaceBackgroundUrl: '',
          texts: [],
          type: 'back',
          userImages: null,
          userTextZones: [],
        },
      ],
      name: 'PGM1207',
      openOrientation: 'right',
      parentDimensions: {
        height: 179,
        width: 125,
      },
    },
  },
};

const canvas = new fabric.Canvas(
  document.querySelector('#fCanvas'),
  jsonData.variables.template_data.faces[0].dimensions
);

const finalJson = await loadLayer(
  jsonData.variables.template_data.faces[0],
  1,
  false
);
console.log(finalJson);
canvas.loadFromJSON(finalJson.canvasJson, () => {
  console.log(canvas);
  canvas.renderAll.bind(canvas);
});
