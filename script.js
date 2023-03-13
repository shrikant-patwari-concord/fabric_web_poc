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
      selectable: true,
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
      selectable: true,
      eventable: false,
    },
    // editable area button with icon group settings
    editableAreaButtonGroupDefault: {
      name: 'areaButton',
      selectable: true,
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
      selectable: true,
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
      selectable: true,
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
      selectable: true,
      evented: true,
      lockMovementX: true,
      lockMovementY: true,
      hasImg: false,
    },
    // the defaults for images added on photozones
    imagePhotozoneDefaultSettings: {
      name: 'userUploadedImage',
      userUploaded: true,
      selectable: true,
      evented: false,
      lockScalingFlip: true,
      angle: 0,
    },
    // the defaults for the overlay images used on photocards (the photoframe)
    overlayImageDefaultSettings: {
      name: 'overlayImg',
      evented: false,
      selectable: true,
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
      let scaleX = 1,
        scaleY = 1,
        iScaleX = d.image.scaleX || 1,
        iScaleY = d.image.scaleY || 1,
        left = 0,
        top = 0,
        imageWidth = d.image?.cropRect?.width || d.image?.width || 0,
        imageHeight = d.image?.cropRect?.height || d.image?.height || 0;
      console.log(
        typeof d.userDefined === 'undefined' &&
          typeof d.image.scaleX === 'undefined' &&
          typeof d.image.scaleY === 'undefined'
      );
      if (typeof d.userDefined === 'undefined') {
        const canvasWidth = d.width || layer.dimensions.width,
          canvasHeight = d.height || layer.dimensions.height,
          isCustomWidthDefined = d.width ? true : false,
          isCustomHeightDefined = d.height ? true : false;

        if (imageWidth * scaleX > imageHeight * scaleY) {
          scaleX = scaleY = canvasHeight / (imageHeight * scaleY);
        }
        if (imageWidth * scaleX < imageHeight * scaleY) {
          scaleX = scaleY = canvasWidth / (imageWidth * scaleX);
        }
        if (imageWidth * scaleX < canvasWidth) {
          scaleX = scaleY = canvasWidth / (imageWidth * scaleX);
        }
        if (imageHeight * scaleY < canvasHeight) {
          scaleX = scaleY = canvasHeight / (imageHeight * scaleY);
        }

        scaleX = scaleX * iScaleX;
        scaleY = scaleY * iScaleY;
        if (isCustomWidthDefined && isCustomHeightDefined) {
          if (imageWidth * scaleX > canvasWidth) {
            left = left - (imageWidth * scaleX - canvasWidth) / 2;
            top = top - (imageHeight * scaleY - canvasHeight) / 2;
          } else {
            top = top - (imageHeight * scaleY - canvasHeight) / 2;
            left = left - (imageWidth * scaleX - canvasWidth) / 2;
          }
        } else {
          left = (canvasWidth - imageWidth * scaleX) / 2;
          top = (canvasHeight - imageHeight * scaleY) / 2;
        }
      }

      left = d.image.left / 0.255 || 0 || 0;
      top = d.image.top / 0.255 || 0 || 0;

      let point = {
        x: left,
        y: top,
      };
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
        width: imageWidth,
        height: imageHeight,
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
        selectable: true,
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
        selectable: true,
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
        originY: 'top',
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
  project_id: 'cbddd9ba-65fa-43b8-884a-c20fb4bebbf9',
  account_id: '2125448473',
  name: 'test',
  product_id: '2PGM1285',
  scan_code: '0002387123',
  version: 1,
  is_digital_fulfillment: false,
  expiration_date: '2023-03-16T13:25:25.552494976Z',
  project_type_code: 'P',
  project_status_code: 'C',
  created_at: '2023-03-09T13:25:25.552517619Z',
  last_updated_at: '2023-03-09T13:25:25.552520175Z',
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
    product_id: '2PGM1285',
    template_id: 'PGM1285',
    product_name: 'Personalized Elegant Merry Christmas Photo Card',
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
            'https://content.dev.hallmark.com/webassets/PGM1285/PGM1285_P1_Background.png',
          canvasJson: null,
          dimensions: {
            height: 2114,
            width: 1476,
          },
          editableAreas: [],
          faceId: 1,
          frameUrl:
            'https://content.dev.hallmark.com/webassets/PGM1285/PGM1285_P1_Frame.png',
          isEditable: true,
          overlayBackgroundUrl: '',
          photoZones: [
            {
              height: 1547.4347,
              left: -47.244,
              angle: 0,
              top: -50.7873,
              width: 1504.7214,
              image: {
                playableDuration: null,
                height: 4032,
                width: 3024,
                filename: 'IMG_4064.JPG',
                extension: 'jpg',
                fileSize: 2236627,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/c511dd40-84fb-4085-bede-ee414f1987856848489594515705305.JPG',
                type: 'image',
                translateX: 188.5,
                localUrl: 'ph://AA015AF0-608C-433B-B8BB-034C514EF87D/L0/001',
                imageId: 'ca7a2949-1bb1-4a32-8e39-43febf8a69a4',
                photoTrayId: '16eaa86d-29e7-4eda-a054-0c6a7eba5288',
                sliderIndex: 0,
                left: 34.5,
                top: 37,
                angle: 0,
              },
            },
          ],
          previewUrl:
            'https://content.dev.hallmark.com/webassets/PGM1285/PGM1285_P1_Preview.png',
          replaceBackgroundUrl: '',
          texts: [
            {
              fontFamily: 'Sincerely',
              fontId: 124,
              fontSize: 18,
              height: 145.86702,
              isFixed: true,
              isHybrid: false,
              isMultiline: false,
              left: 743.5659,
              angle: 0,
              text: 'Cameron',
              textAlign: 'center',
              textColor: '#A48A47',
              top: 1780.8751,
              width: 575.99884,
            },
          ],
          type: 'front',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.dev.hallmark.com/webassets/PGM1285/PGM1285_P2-3_Background.png',
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
          photoZones: [],
          previewUrl:
            'https://content.dev.hallmark.com/webassets/PGM1285/PGM1285_P2-3_Preview.png',
          replaceBackgroundUrl: '',
          texts: [],
          type: 'inside',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.dev.hallmark.com/webassets/PGM1285/PGM1285_P4_Background.png',
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
            'https://content.dev.hallmark.com/webassets/PGM1285/PGM1285_P4_Preview.png',
          replaceBackgroundUrl: '',
          texts: [],
          type: 'back',
          userImages: null,
          userTextZones: [],
        },
      ],
      name: 'PGM1285',
      openOrientation: 'right',
      parentDimensions: {
        height: 179,
        width: 125,
      },
    },
  },
};

jsonData.variables.template_data.faces.forEach(async (face, index) => {
  const finalJson = await loadLayer(face, index + 1, false);
  if (index == 0) {
    const fcanvas = new fabric.Canvas(
      document.querySelector('#fCanvas'),
      face.dimensions
    );
    console.log(finalJson);
    fcanvas.loadFromJSON(finalJson.CanvasJson, () => {
      console.log(fcanvas);
      fcanvas.renderAll.bind(fcanvas);
    });
  }
  if (index == 1) {
    const icanvas = new fabric.Canvas(
      document.querySelector('#iCanvas'),
      face.dimensions
    );
    console.log(finalJson);
    icanvas.loadFromJSON(finalJson.CanvasJson, () => {
      console.log(icanvas);
      icanvas.renderAll.bind(icanvas);
    });
  }
});
