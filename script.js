const configStore = (function () {
  // general default stuff that will help us set some options
  var spacingUnit = 20; // this is the old textPadding

  var defaultFont = 'fontid-107'; // Annette Print ("Hey sunshine")

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
      d.imageId && userImages.push(d.imageId);
      let scaleX = d.image.scale,
        scaleY = d.image.scale,
        left = (d.image.insideWidth || 0) + d.left || 0,
        top = d.top || 0;
      if (typeof d.userDefined === 'undefined') {
        const canvasWidth = d.width || layer.dimensions.width,
          canvasHeight = d.height || layer.dimensions.height,
          isCustomWidthDefined = d.width ? true : false,
          isCustomHeightDefined = d.height ? true : false;

        if (d.image.width * scaleX < canvasWidth) {
          scaleX = scaleY = canvasWidth / (d.image.width * scaleX);
        } else {
          if (d.image.width * scaleX > d.image.height * scaleY) {
            scaleX = scaleY = canvasHeight / (d.image.height * scaleY);
          } else {
            scaleX = scaleY = canvasWidth / (d.image.width * scaleX);
          }
        }
        if (d.image.height * scaleY < canvasHeight) {
          scaleX = scaleY = canvasHeight / (d.image.height * scaleY);
        } else {
          if (d.image.width * scaleX > d.image.height * scaleY) {
            scaleX = scaleY = canvasHeight / (d.image.height * scaleY);
          } else {
            scaleX = scaleY = canvasWidth / (d.image.width * scaleX);
          }
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
      canvasJson.objects.push({
        type: 'image',
        version: '3.6.6',
        left: left,
        top: top,
        scaleX: scaleX || 1,
        scaleY: scaleY || 1,
        userAddedPhotoId: d.image.imageId,
        angle: radToDegree(d.image.angle),
        originX: 'left',
        originY: 'top',
        centeredRotation: d.userDefined || false,
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
          d.userDefined || false
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
        fontFamily: `fontid-${d.fontId}`,
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
    canvasJson,
    UserImages: userImages,
    FaceId: faceNumber,
    FaceNumber: faceNumber,
  };
};

/**
 *
 * cache image locally and skip network call if loccally available
 */
let loadImage = function (configKey, canvas, dataOptions) {
  return new Promise((resolve, reject) => {
    if (dataOptions.url) {
      try {
        fabric.Image.fromURL(
          dataOptions.url,
          (img, err) => {
            if (err) reject(err);
            else {
              if (configKey) {
                if (configKey === 'imagePhotozoneDefaultSettings') {
                  img.set(
                    Object.assign({}, configStore[configKey], dataOptions.image)
                  );
                  if (dataOptions.userDefined === false) {
                    const canvasWidth = dataOptions.width || canvas.getWidth(),
                      canvasHeight = dataOptions.height || canvas.getHeight(),
                      isCustomWidthDefined = dataOptions.width ? true : false,
                      isCustomHeightDefined = dataOptions.height ? true : false;

                    if (img.getScaledWidth() < canvasWidth) {
                      img.scaleToWidth(canvasWidth);
                    } else {
                      if (img.getScaledWidth() > img.getScaledHeight()) {
                        img.scaleToHeight(canvasHeight);
                      } else {
                        img.scaleToWidth(canvasWidth);
                      }
                    }
                    if (img.getScaledHeight() < canvasHeight) {
                      img.scaleToHeight(canvasHeight);
                    } else {
                      if (img.getScaledWidth() > img.getScaledHeight()) {
                        img.scaleToHeight(canvasHeight);
                      } else {
                        img.scaleToWidth(canvasWidth);
                      }
                    }
                    if (isCustomWidthDefined && isCustomHeightDefined) {
                      if (img.getScaledWidth() > canvasWidth) {
                        img.set({
                          left:
                            img.left - (img.getScaledWidth() - canvasWidth) / 2,
                        });
                      } else {
                        img.set({
                          top:
                            img.top -
                            (img.getScaledHeight() - canvasHeight) / 2,
                        });
                      }
                    } else {
                      canvas.centerObject(img);
                    }
                    img.setCoords();
                  }
                  canvas.add(img);
                } else if (configKey === 'backgroundImage') {
                  img.set(dataOptions.image);
                  canvas.setBackgroundImage(img);
                } else {
                  img.set(
                    Object.assign({}, configStore[configKey], dataOptions.image)
                  );
                  canvas.add(img);
                }
              }
              canvas.requestRenderAll();
              resolve(img);
            }
          },
          {
            crossOrigin: 'anonymous',
          }
        );
      } catch (error) {
        console.error('failed to load image', error);
        reject(error);
      }
    } else {
      console.log(src, configKey, dataOptions);
      reject('failed to load image src is empty');
    }
  });
};

const jsonData = {
  project_id: 'b44a3030-8cec-42b5-804e-2734c72c001f',
  account_id: '2125479117',
  name: 'test',
  product_id: '2PGM1278',
  scan_code: '0002381790',
  version: 1,
  is_digital_fulfillment: false,
  expiration_date: '2023-02-23T13:52:38.906933215Z',
  project_type_code: 'P',
  project_status_code: 'C',
  created_at: '2023-02-16T13:52:38.906953626Z',
  last_updated_at: '2023-02-16T13:52:38.906954949Z',
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
    product_id: '2PGM1278',
    template_id: 'PGM1278',
    product_name: 'Personalized Naughty and Nice Christmas Photo Card',
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
            'https://content.dev.hallmark.com/webassets/PGM1278/PGM1278_P1_Background.png',
          canvasJson: null,
          dimensions: {
            height: 2114,
            width: 1476,
          },
          editableAreas: [],
          faceId: 1,
          frameUrl:
            'https://content.dev.hallmark.com/webassets/PGM1278/PGM1278_P1_Frame.png',
          isEditable: true,
          overlayBackgroundUrl: '',
          photoZones: [
            {
              height: 676.1655,
              left: 725.23676,
              angle: 6.5,
              top: 143.26506,
              width: 791.5283,
              image: {
                playableDuration: null,
                height: 2500,
                width: 1668,
                filename: 'IMG_0004.JPG',
                extension: 'jpg',
                fileSize: 1268382,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/a2472d53-808f-4da3-9eb2-a6e8a7fc80e84799660975768660701.JPG',
                type: 'image',
                translateX: 0,
                localUrl: 'ph://99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7/L0/001',
                imageId: '44df536d-7f31-4e62-b054-aa896cf92a61',
                photoTrayId: '6acf9ce1-c4af-46e9-ac68-a58bedf30df0',
                sliderIndex: 0,
                scale: 0.4269148049340352,
              },
            },
            {
              height: 646.16565,
              left: -118.00488,
              angle: 355,
              top: 937.4308,
              width: 719.96783,
              image: {
                playableDuration: null,
                height: 2002,
                width: 3000,
                filename: 'IMG_0003.JPG',
                extension: 'jpg',
                fileSize: 2505426,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/3dfad1a0-f8a8-4bb0-83d5-6c3a1c121e2d919843791599379793.JPG',
                type: 'image',
                translateX: 0,
                localUrl: 'ph://9F983DBA-EC35-42B8-8773-B597CF782EDD/L0/001',
                imageId: 'fe21965b-6086-4760-b8e0-ed52f4d7fd26',
                photoTrayId: '7cd6620c-d266-4b09-90ad-d9c999b55998',
                sliderIndex: 0,
                scale: 0.44852373586681854,
              },
            },
          ],
          previewUrl:
            'https://content.dev.hallmark.com/webassets/PGM1278/PGM1278_P1_Preview.png',
          replaceBackgroundUrl: '',
          texts: [],
          type: 'front',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.dev.hallmark.com/webassets/PGM1278/PGM1278_P2-3_Background.png',
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
              left: 0,
              top: 600,
              image: {
                playableDuration: null,
                height: 2500,
                width: 1668,
                filename: 'IMG_0004.JPG',
                extension: 'jpg',
                fileSize: 1268382,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/68c65686-d4f9-4f64-9592-a16c19dce4c96032467244848876436.JPG',
                type: 'image',
                translateX: 0,
                localUrl: 'ph://99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7/L0/001',
                imageId: '23d901f9-a2a8-49c3-88df-3d895870d4ae',
                photoTrayId: '1d147fd4-9374-473c-a8df-23bd0b5c685e',
                sliderIndex: 2,
                scale: 0.749,
                insideWidth: 1435,
                angle: 0.78,
              },
              userDefined: true,
            },
            {
              left: 69.33332824707031,
              image: {
                playableDuration: null,
                height: 2848,
                width: 4288,
                filename: 'IMG_0001.JPG',
                extension: 'jpg',
                fileSize: 1896240,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/aae6aa50-503b-4adf-a0aa-7ab5c30d811a907430288210826867.JPG',
                type: 'image',
                translateX: 0,
                localUrl: 'ph://106E99A1-4F6A-45A2-B320-B0AD4A8E8473/L0/001',
                imageId: '61b3a0d4-0bcc-4284-bbba-30cdd37ddfb6',
                photoTrayId: 'd8df3fc4-ea7f-469d-aa95-47d044f73c7e',
                sliderIndex: 1,
                scaleX: 1.2168674843773721,
                scaleY: 1.2168674843773721,
                scale: 0.33,
                angle: -1.01,
              },
              userDefined: true,
              top: 1012.000015258789006,
            },
          ],
          previewUrl:
            'https://content.dev.hallmark.com/webassets/PGM1278/PGM1278_P2-3_Preview.png',
          replaceBackgroundUrl: '',
          texts: [],
          type: 'inside',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.dev.hallmark.com/webassets/PGM1278/PGM1278_P4_Background.png',
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
            'https://content.dev.hallmark.com/webassets/PGM1278/PGM1278_P4_Preview.png',
          replaceBackgroundUrl: '',
          texts: [],
          type: 'back',
          userImages: null,
          userTextZones: [],
        },
      ],
      name: 'PGM1278',
      openOrientation: 'right',
      parentDimensions: {
        height: 179,
        width: 125,
      },
    },
  },
};

console.log(loadLayer(jsonData.variables.template_data.faces[1], 2, false));
