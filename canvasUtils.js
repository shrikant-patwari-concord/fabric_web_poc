const logger = {
  info: console.log,
};

const canvasUtil = (function () {
  let projectObj = { personalization: [] };
  let activeFace = null;

  /**
   * Utility function used internally to perform common operations
   * @private
   * @returns {Object} having several methods to use
   */
  const helperStore = (function () {
    const piBy2 = Math.PI / 2;
    const piBy180 = Math.PI / 180;
    const defaultUserDefinedImagePortraitWidth = 200;
    const defaultUserDefinedLandscapeWidth = 100;
    /**
     * Create clone of an object
     * @private
     * @param {Object} [inObject] any object or array which need to deep copied
     *
     * @returns {Object} brand new deeply copied object instance
     */
    function deepCopy(inObject) {
      if (typeof inObject !== 'object' || inObject === null) {
        return inObject;
      }

      const outObject = Array.isArray(inObject) ? [] : {};

      Object.keys(inObject).forEach((key) => {
        const val = inObject[`${key}`];
        outObject[`${key}`] = deepCopy(val);
      });

      return outObject;
    }
    return {
      getDefaultUserDefinedImageWidth: function (cardFormat) {
        return cardFormat &&
          typeof cardFormat === 'string' &&
          cardFormat.toLowerCase() === 'landscape'
          ? defaultUserDefinedLandscapeWidth
          : defaultUserDefinedImagePortraitWidth;
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
      radToDegree: function (rad) {
        return (rad || 0) / piBy180;
      },
      degreesToRadians: function (deg) {
        return (deg || 0) * piBy180;
      },
      rotateVector: function (vector, radians) {
        var sin = this.sin(radians),
          cos = this.cos(radians),
          rx = vector.x * cos - vector.y * sin,
          ry = vector.x * sin + vector.y * cos;
        return {
          x: rx,
          y: ry,
        };
      },
      rotatePoint: function (point, origin, radians) {
        var newPoint = { x: point.x - origin.x, y: point.y - origin.y },
          v = this.rotateVector(newPoint, radians);
        return { x: v.x + origin.x, y: v.y + origin.y };
      },
      debounce: function (func, delay) {
        let timeoutId;
        return function () {
          const context = this;
          const args = arguments;

          clearTimeout(timeoutId);
          timeoutId = setTimeout(function () {
            func.apply(context, args);
          }, delay);
        };
      },
      generateUUID: function () {
        // Public Domain/MIT
        var d = new Date().getTime(); //Timestamp
        var d2 =
          (typeof performance !== 'undefined' &&
            performance.now &&
            performance.now() * 1000) ||
          0; //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g,
          function (c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) {
              //Use timestamp until depleted
              r = (d + r) % 16 | 0;
              d = Math.floor(d / 16);
            } else {
              //Use microseconds since page-load if supported
              r = (d2 + r) % 16 | 0;
              d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
          }
        );
      },
      deepCopy,
    };
  })();

  function cleanUp() {
    projectObj = { personalization: [] };
  }

  function initializeProject(project_id, product_id, is_digital_fulfillment) {
    cleanUp();
    projectObj['project_id'] = project_id;
    projectObj['product_id'] = product_id;
    projectObj['is_digital_fulfillment'] = is_digital_fulfillment;
  }

  function addAndActivateFace(
    faceId,
    index,
    faceDimensions,
    layoutDimensions,
    cardFormat,
    type,
    cardType
  ) {
    const widthDivisionFactor =
        faceId === 2 && cardFormat.toLowerCase() === 'portrait' ? 2 : 1,
      heightDivisionFactor =
        faceId === 2 && cardFormat.toLowerCase() !== 'portrait' ? 2 : 1;
    console.log({ widthDivisionFactor, heightDivisionFactor });
    projectObj.personalization.push({
      faceId: faceId,
      faceNumber: faceId,
      canvasJson: {
        version: '5.2.1',
        objects: [],
      },
      printJson: null,
      userImages: [],
      canvasDimensions: faceDimensions,
      cardFormat: cardFormat,
      cardSize: layoutDimensions,
      canvasLayout: {
        width: faceDimensions.width / widthDivisionFactor,
        height: faceDimensions.height / heightDivisionFactor,
      },
      type: type,
      cardType: cardType,
      multiplierX:
        faceDimensions.width / widthDivisionFactor / layoutDimensions.width,
      multiplierY:
        faceDimensions.height / heightDivisionFactor / layoutDimensions.height,
    });
    activeFace =
      projectObj.personalization[projectObj.personalization.length - 1];
  }

  function addBackgroundImage(url) {
    activeFace.canvasJson.backgroundImage = {
      type: 'image',
      version: '5.2.1',
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      width: activeFace.canvasDimensions.width,
      height: activeFace.canvasDimensions.height,
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
      src: url,
      crossOrigin: 'anonymous',
      filters: [],
    };
  }

  function addPhotoZoneImages(zone, index) {
    let photoRect = null;
    if (typeof zone['userDefined'] === 'undefined') {
      photoRect = {
        type: 'rect',
        version: '5.2.1',
        originX: 'left',
        originY: 'top',
        left: zone.left + 18,
        top: zone.top + 18,
        width: zone.width + 18,
        height: zone.height + 18,
        fill: '#838684',
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
        angle: zone.angle || 0,
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
        name: `photozone-${index}`,
      };
      activeFace.canvasJson.objects.push(photoRect);
    }
    if (zone.image && zone.image.uri) {
      const imageWidth = zone.image.width,
        imageHeight = zone.image.height;
      if (typeof zone['userDefined'] === 'undefined') {
        const photoZoneWidth = photoRect.width,
          photoZoneHeight = photoRect.height,
          photoZoneAngle = photoRect.angle || 0;
        let scaleX = 1,
          scaleY = 1,
          left = photoRect.left,
          top = photoRect.top,
          imageAngle =
            helperStore.radToDegree(zone.image.angle || 0) ||
            photoZoneAngle ||
            0;

        if (imageWidth * scaleX > imageHeight * scaleY) {
          const scale = photoZoneHeight / (imageHeight * scaleY);
          scaleX = scaleY = scaleX * scale;
        }
        if (imageWidth * scaleX < imageHeight * scaleY) {
          const scale = photoZoneWidth / (imageWidth * scaleX);
          scaleX = scaleY = scaleX * scale;
        }
        if (imageWidth * scaleX < photoZoneWidth) {
          const scale = photoZoneWidth / (imageWidth * scaleX);
          scaleX = scaleY = scaleX * scale;
        }
        if (imageHeight * scaleY < photoZoneHeight) {
          const scale = photoZoneHeight / (imageHeight * scaleY);
          scaleX = scaleY = scaleX * scale;
        }

        // Actual scale calculation
        if (zone.image.scaleX) {
          scaleX *= zone.image.scaleX;
        }
        if (zone.image.scaleY) {
          scaleY *= zone.image.scaleY;
        }

        const imageCenterPoint = {
          x: left + zone.image.centerPoint.x * activeFace.multiplierX,
          y: top + zone.image.centerPoint.y * activeFace.multiplierY,
        };

        const objLeftTop = {
          x: imageCenterPoint.x - (imageWidth * scaleX) / 2,
          y: imageCenterPoint.y - (imageHeight * scaleY) / 2,
        };

        if (imageAngle) {
          const rotatePoint = helperStore.rotatePoint(
            objLeftTop,
            imageCenterPoint,
            helperStore.degreesToRadians(imageAngle)
          );
          objLeftTop.x = rotatePoint.x;
          objLeftTop.y = rotatePoint.y;
        }
        const imageObj = {
          type: 'image',
          version: '5.2.1',
          originX: 'left',
          originY: 'top',
          left: objLeftTop.x,
          top: objLeftTop.y,
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
          scaleX: scaleX,
          scaleY: scaleY,
          angle: imageAngle,
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
          clipPath: {
            type: 'rect',
            version: '5.2.1',
            originX: 'left',
            originY: 'top',
            left: photoRect.left,
            top: photoRect.top,
            width: photoRect.width,
            height: photoRect.height,
            fill: 'rgb(0,0,0)',
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: 'butt',
            strokeDashOffset: 0,
            strokeLineJoin: 'miter',
            strokeUniform: false,
            strokeMiterLimit: 4,
            scaleX: photoRect.scaleX,
            scaleY: photoRect.scaleY,
            angle: photoRect.angle,
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
          },
          cropX: 0,
          cropY: 0,
          name: `${photoRect.name}-${
            zone.image.imageId || helperStore.generateUUID()
          }`,
          src: zone.image.uri,
          crossOrigin: 'anonymous',
          filters: [],
          userDefined: false,
        };
        activeFace.canvasJson.objects.push(imageObj);
      } else {
        let scaleX = 1,
          scaleY = 1,
          left = zone.image.insideWidth || 0,
          top = zone.image.insideHeight || 0,
          imageAngle = helperStore.radToDegree(zone.image.angle || 0);
        scaleX = scaleY =
          (helperStore.getDefaultUserDefinedImageWidth(activeFace.cardFormat) /
            imageWidth) *
          activeFace.multiplierX;
        // Actual scale calculation
        if (zone.image.scaleX) {
          scaleX *= zone.image.scaleX;
        }
        if (zone.image.scaleY) {
          scaleY *= zone.image.scaleY;
        }
        const imageCenterPoint = {
          x: left + zone.image.centerPoint.x * activeFace.multiplierX,
          y: top + zone.image.centerPoint.y * activeFace.multiplierY,
        };

        const objLeftTop = {
          x: imageCenterPoint.x - (imageWidth * scaleX) / 2,
          y: imageCenterPoint.y - (imageHeight * scaleY) / 2,
        };
        if (imageAngle) {
          const rotatePoint = helperStore.rotatePoint(
            objLeftTop,
            imageCenterPoint,
            helperStore.degreesToRadians(imageAngle)
          );
          objLeftTop.x = rotatePoint.x;
          objLeftTop.y = rotatePoint.y;
        }
        const imageObj = {
          type: 'image',
          version: '5.2.1',
          originX: 'left',
          originY: 'top',
          left: objLeftTop.x,
          top: objLeftTop.y,
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
          scaleX: scaleX,
          scaleY: scaleY,
          angle: imageAngle || 0,
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
          name: `userImage-${activeFace.faceId}-${
            zone.image.imageId || helperStore.generateUUID()
          }`,
          src: zone.image.uri,
          crossOrigin: 'anonymous',
          filters: [],
          userDefined: true,
        };
        activeFace.canvasJson.objects.push(imageObj);
        if (zone.image.imageId) {
          activeFace.userImages.push(zone.image.imageId);
        }
      }
    }
  }

  function addFrameImage(url) {
    const frameImageObj = {
      type: 'image',
      version: '5.2.1',
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      width: activeFace.canvasDimensions.width,
      height: activeFace.canvasDimensions.height,
      fill: 'rgb(0,0,0)',
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
      name: 'overlayImg',
      src: url,
      crossOrigin: 'anonymous',
      filters: [],
    };
    activeFace.canvasJson.objects.push(frameImageObj);
  }

  function addTextObj(textZone, textIndex) {
    let scaleX = 1,
      scaleY = 1,
      left = textZone.insideWidth || 0,
      top = textZone.insideHeight || 0;

    let textAngle = 0;
    const isPredefinedText = typeof textZone['userDefined'] === 'undefined';
    if (isPredefinedText) {
      textAngle = textZone.angle || 0;
    } else {
      textAngle = helperStore.radToDegree(textZone.angle || 0);
    }

    // Actual scale calculation
    if (textZone.scaleX) {
      scaleX *= textZone.scaleX;
    }

    if (textZone.scaleY) {
      scaleY *= textZone.scaleY;
    }

    // if (typeof textZone.centerPoint === 'undefined') {
    //   textZone.centerPoint = {
    //     x: (textZone.left + textZone.width / 2) / activeFace.multiplierX,
    //     y: (textZone.top + textZone.height / 2) / activeFace.multiplierY,
    //   };
    // }

    // const textCenterPoint = {
    //   x: left + textZone.centerPoint.x * activeFace.multiplierX,
    //   y: top + textZone.centerPoint.y * activeFace.multiplierY,
    // };

    const objLeftTop = {
      x: textZone.left,
      y: textZone.top,
    };
    // if (textAngle) {
    //   const rotatePoint = helperStore.rotatePoint(
    //     objLeftTop,
    //     {
    //       x: activeFace.canvasLayout.width / 2,
    //       y: activeFace.canvasLayout.height / 2,
    //     },
    //     helperStore.degreesToRadians(textAngle)
    //   );
    //   objLeftTop.x = rotatePoint.x;
    //   objLeftTop.y = rotatePoint.y;
    // }
    const textObj = {
      type: 'textbox',
      version: '5.2.1',
      originX: 'left',
      originY: 'top',
      left: objLeftTop.x + (isPredefinedText ? 18 : 0),
      top: objLeftTop.y + (isPredefinedText ? 18 : 0),
      width: textZone.width + (isPredefinedText ? 18 : 0),
      // height: textZone.height + (isPredefinedText ? 18 : 0),
      fill: textZone.textColor,
      stroke: null,
      strokeWidth: 1,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: scaleX,
      scaleY: scaleY,
      angle: textAngle || 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      shadow: null,
      visible: true,
      backgroundColor: '#ddd',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      fontFamily: `fontid-${textZone.fontId}`,
      fontWeight: 'normal',
      fontSize: isPredefinedText
        ? textZone.fontSize * 4
        : textZone.fontSize * 5.33,
      text: textZone.text,
      underline: false,
      overline: false,
      linethrough: false,
      textAlign: textZone.textAlign,
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
      padding: 50,
      minWidth: 20,
      splitByGrapheme: false,
      name: `userTextbox-${activeFace.faceId}-${textIndex}`,
    };

    activeFace.canvasJson.objects.push(textObj);
  }

  /**
   * Returns true or false for showing background image
   * @private
   * @param {String} [cardType] type of card e.g. photo, woodenphoto etc.
   * @param {String} [faceType] type of face e.g. front, inside or back
   * @returns {Boolean} Should background image visible
   */
  function showBackgroundImage(cardType, faceType) {
    if (faceType === 'front') {
      return !(
        cardType === 'photo' ||
        cardType === 'woodenphoto' ||
        cardType === 'chocophoto' ||
        cardType === 'vederephoto'
      );
    }

    if (faceType === 'back') {
      return !(cardType === 'vedere' || cardType === 'vederephoto');
    }

    return true;
  }

  /**
   * Create Print JSon object
   */
  function buildPrintJson() {
    const bleed = 18;
    projectObj.personalization.forEach((face) => {
      face.printJson = helperStore.deepCopy(face.canvasJson);
      if (face.printJson.backgroundImage) {
        face.printJson.backgroundImage.visible = showBackgroundImage(
          face.cardType,
          face.type
        );
      }
      if (!projectObj['is_digital_fulfillment']) {
        face.printJson.objects.forEach((canvasObject) => {
          if (canvasObject.clipPath) {
            canvasObject.clipPath.left = canvasObject.clipPath.left + bleed;
            canvasObject.clipPath.top = canvasObject.clipPath.top + bleed;
          }

          canvasObject.left = canvasObject.left + bleed;
          canvasObject.top = canvasObject.top + bleed;
        });
      }
    });
  }

  function getFinalJson() {
    try {
      buildPrintJson();
      return JSON.parse(JSON.stringify(projectObj));
    } catch (e) {
      console.error(e);
    }
  }

  return {
    initializeProject,
    addAndActivateFace,
    addBackgroundImage,
    addPhotoZoneImages,
    addFrameImage,
    addTextObj,
    getFinalJson,
  };
})();

const getCanvasJSON = function (projectData) {
  logger.info('customisation-save-customFabObj', projectData);
  const cardFormat = projectData.variables.template_data.cardFormat;
  const cardType = projectData.variables.template_data.cardType;
  const layoutDimensions = {
    width: projectData.layoutWidth,
    height: projectData.layoutHeight,
  };
  canvasUtil.initializeProject(
    projectData.project_id,
    projectData.product_id,
    projectData.is_digital_fulfillment
  );
  projectData.variables.template_data.faces.forEach((face, index) => {
    const faceDimensions = face.dimensions;
    const backgroundUrl = face.backgroundUrl;
    const frameUrl = face.frameUrl;
    const type = face.type;
    canvasUtil.addAndActivateFace(
      face.faceId,
      index,
      faceDimensions,
      layoutDimensions,
      cardFormat,
      type,
      cardType
    );
    if (backgroundUrl) {
      canvasUtil.addBackgroundImage(backgroundUrl);
    }
    if (
      face.photoZones &&
      Array.isArray(face.photoZones) &&
      face.photoZones.length
    ) {
      face.photoZones.forEach((photoZone, photoIndex) => {
        if (!(typeof photoZone.deleted === 'boolean' && photoZone.deleted)) {
          canvasUtil.addPhotoZoneImages(photoZone, photoIndex);
        }
      });
    }
    if (frameUrl) {
      canvasUtil.addFrameImage(frameUrl);
    }
    if (face.texts && Array.isArray(face.texts) && face.texts.length) {
      face.texts.forEach((textObj, textObjIndex) => {
        if (!(typeof textObj.isDeleted === 'boolean' && textObj.isDeleted)) {
          canvasUtil.addTextObj(textObj, textObjIndex);
        }
      });
    }
  });
  const finalJson = canvasUtil.getFinalJson();
  logger.info('customisation-save-finalJson', finalJson);
  return finalJson;
};

// const prjDt = {
//   project_id: '63ad8fab-712d-4af8-a0ed-69a9e0b4acca',
//   account_id: '2118391361',
//   name: 'test',
//   product_id: '2PGM1270',
//   scan_code: '0006846480',
//   version: 1,
//   is_digital_fulfillment: false,
//   expiration_date: '2023-06-08T08:43:50.221121897Z',
//   project_type_code: 'P',
//   project_status_code: 'C',
// layoutWidth: 290.66668701171875,
// layoutHeight: 416,
//   created_at: '2023-06-01T08:43:50.221146266Z',
//   last_updated_at: '2023-06-01T08:43:50.221147853Z',
//   font_collection: {
//     default_size: 55,
//     default_color: '#000000',
//     fonts: [
//       {
//         id: 101,
//         name: 'Simply Yours',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/108317.ttf',
//       },
//       {
//         id: 102,
//         name: 'Grateful for You',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/126056.ttf',
//       },
//       {
//         id: 103,
//         name: 'Warmest Wishes',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/BerdingScript.ttf',
//       },
//       {
//         id: 104,
//         name: 'Yours Always',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/TuesdayHMK-MGE.ttf',
//       },
//       {
//         id: 105,
//         name: 'All My Best',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/KrickHMK-Regular.ttf',
//       },
//       {
//         id: 106,
//         name: 'Take It Easy',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/JohnsonBallpointPen.ttf',
//       },
//       {
//         id: 107,
//         name: 'Hey Sunshine',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/AnnettePrintMGE-Regular.ttf',
//       },
//       {
//         id: 108,
//         name: 'Stay Strong',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/JasonPrint.ttf',
//       },
//       {
//         id: 109,
//         name: "'Til Next Time",
//         url: 'https://content.stage.hallmark.com/POD_Fonts/126059.ttf',
//       },
//       {
//         id: 110,
//         name: 'Catch You Later',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/JohnsonPrint.ttf',
//       },
//       {
//         id: 111,
//         name: 'Keep in Touch',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/JenniferPrintLight.ttf',
//       },
//       {
//         id: 112,
//         name: 'Hugs to You',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/BrentPrint.ttf',
//       },
//       {
//         id: 113,
//         name: 'Kind Regards',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/TypewriteWornOneHMK.ttf',
//       },
//       {
//         id: 114,
//         name: 'Buh-Bye',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/AmbergerSansTextA.ttf',
//       },
//       {
//         id: 115,
//         name: 'Cheers to You',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/BeamNewHMK-Regular.ttf',
//       },
//       {
//         id: 116,
//         name: 'Later Gator',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/CrayottBookKB.ttf',
//       },
//       {
//         id: 117,
//         name: 'WHAT’S UP',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/AlmondMilkHMK-Regular.ttf',
//       },
//       {
//         id: 119,
//         name: 'Just Saying',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/SarahndipityHMK-Smooth.ttf',
//       },
//       {
//         id: 120,
//         name: 'OMG Hi',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/BeamNewHMK-Bold.ttf',
//       },
//       {
//         id: 121,
//         name: "How Ya Doin'",
//         url: 'https://content.stage.hallmark.com/POD_Fonts/HelloOne-HMK.ttf',
//       },
//       {
//         id: 122,
//         name: 'Just a Note',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/AstaSlabHMK-Medium.ttf',
//       },
//       {
//         id: 123,
//         name: 'Keep Smiling',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/MiziletteHMK-SemiBoldUpright.ttf',
//       },
//       {
//         id: 124,
//         name: 'Sincerely',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/QueensHatHMK-Italic.ttf',
//       },
//       {
//         id: 125,
//         name: 'Hiya Pal',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/MichaelaVFHMK.ttf',
//       },
//       {
//         id: 126,
//         name: 'Be Seeing You',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/FieldnotesHMK-Rough.ttf',
//       },
//       {
//         id: 127,
//         name: 'Good Vibes',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/GretaHMK-Regular.ttf',
//       },
//       {
//         id: 128,
//         name: 'Best Wishes',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/BernhardFashionOnePKA.ttf',
//       },
//       {
//         id: 129,
//         name: 'Hang Loose',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/RittenPrintLowRiseHMK-Regular.ttf',
//       },
//       {
//         id: 130,
//         name: 'Much Appreciated',
//         url: 'https://content.stage.hallmark.com/POD_Fonts/BethelHMK-Regular.ttf',
//       },
//     ],
//   },
//   product: {
//     product_id: '2PGM1270',
//     template_id: 'PGM1270',
//     product_name: 'Personalized To the Moon and Back Love Photo Card',
//     vendor_lead_time: 1,
//     envelope_color: '#FFFFF',
//   },
//   fulfillment: {},
//   variables: {
//     template_data: {
//       cardFormat: 'portrait',
//       cardSize: '49',
//       cardType: 'photo',
//       dimensions: {
//         height: 179,
//         width: 125,
//       },
//       faces: [
//         {
//           backgroundUrl:
//             'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P1_Background.png',
//           canvasJson: null,
//           dimensions: {
//             height: 2114,
//             width: 1476,
//           },
//           editableAreas: [],
//           faceId: 1,
//           frameUrl:
//             'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P1_Frame.png',
//           isEditable: true,
//           overlayBackgroundUrl: '',
//           photoZones: [
//             {
//               height: 1045.0054,
//               left: 175.74649,
//               angle: 0,
//               top: 346.0623,
//               width: 1069.6383,
//             },
//           ],
//           previewUrl:
//             'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P1_Preview.png',
//           printJson: null,
//           replaceBackgroundUrl: '',
//           texts: [
//             {
//               fontFamily: 'WHAT’S UP',
//               fontId: 117,
//               fontSize: 47,
//               height: 266.7018,
//               isFixed: true,
//               isHybrid: false,
//               isMultiline: false,
//               left: 225.56647,
//               angle: 0,
//               text: 'MATTHEW.',
//               textAlign: 'center',
//               textColor: '#F0F0F0',
//               top: 1684.741,
//               width: 964.9977,
//             },
//           ],
//           type: 'front',
//           userImages: null,
//           userTextZones: [],
//         },
//         {
//           backgroundUrl:
//             'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P2-3_Background.png',
//           canvasJson: null,
//           dimensions: {
//             height: 2114,
//             width: 2870,
//           },
//           editableAreas: [],
//           faceId: 2,
//           frameUrl: '',
//           isEditable: true,
//           overlayBackgroundUrl: '',
//           photoZones: [],
//           previewUrl:
//             'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P2-3_Preview.png',
//           printJson: null,
//           replaceBackgroundUrl: '',
//           texts: [
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 238,
//               angle: -0.6644318617564391,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 976,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 238,
//               angle: -0.8154900046669247,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 976,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 238,
//               angle: -0.9455273691964677,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 976,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 429.3997713993955,
//               angle: -0.7498298570000044,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 1719.9066373603393,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 207.16666793823242,
//                 y: 340.1666717529297,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               multiplierX: 0.19692864973693683,
//               multiplierY: 0.1967833491012299,
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 659.919148182754,
//               angle: 0.3349734574750851,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 1295.0129178408963,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 207.16666793823242,
//                 y: 340.1666717529297,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               multiplierX: 0.19692864973693683,
//               multiplierY: 0.1967833491012299,
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 104.27985170137937,
//               angle: 0.1255302681052774,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 401.7643455358653,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 121.28632275248451,
//                 y: 115.36933157547614,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               multiplierX: 0.19692864973693683,
//               multiplierY: 0.1967833491012299,
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 173.67887775673978,
//               angle: 0.13255511611270698,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 445.8061155906091,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 135.0322753611229,
//                 y: 124.70035473065383,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               multiplierX: 0.19692864973693683,
//               multiplierY: 0.1967833491012299,
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 125,
//               fontSize: 16,
//               height: 245.61698717948713,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 158.4449338689028,
//               angle: 0.12515420240372,
//               text: 'Add your text here',
//               textAlign: 'left',
//               textColor: '#595959',
//               top: 423.7853081042951,
//               width: 1000,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 131.94859301215484,
//                 y: 119.66707370246789,
//               },
//               originalCenterPoint: {
//                 x: 150.66667683919272,
//                 y: 214.8728992977593,
//               },
//               multiplierX: 0.19692864973693683,
//               multiplierY: 0.1967833491012299,
//               isDeleted: true,
//             },
//             {
//               fontFamily: 'Just a Note',
//               fontId: 101,
//               fontSize: 20,
//               height: 234.19957028203035,
//               isFixed: false,
//               isHybrid: false,
//               isMultiline: true,
//               left: 23.904856082357036,
//               angle: 0.1529002999279077,
//               text: 'Vbbb\nVhhh\nChhh\nChhh\n Bbb\nCvbb Chcvhh',
//               textAlign: 'center',
//               textColor: '#595959',
//               top: -0.3789758981285209,
//               width: 915.9665093921379,
//               userDefined: true,
//               insideWidth: 0,
//               sliderIndex: 1,
//               horizontalLayoutWidth: 0,
//               centerPoint: {
//                 x: 114.16665172576901,
//                 y: 93.50000000000001,
//               },
//               originalCenterPoint: {
//                 x: 145.33334350585938,
//                 y: 217.22721538946706,
//               },
//               multiplierX: 0.19692864973693683,
//               multiplierY: 0.1967833491012299,
//             },
//           ],
//           type: 'inside',
//           userImages: null,
//           userTextZones: [],
//         },
//         {
//           backgroundUrl:
//             'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P4_Background.png',
//           canvasJson: null,
//           dimensions: {
//             height: 2114,
//             width: 1394,
//           },
//           editableAreas: [],
//           faceId: 3,
//           frameUrl: '',
//           isEditable: false,
//           overlayBackgroundUrl: '',
//           photoZones: [],
//           previewUrl:
//             'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P4_Preview.png',
//           printJson: null,
//           replaceBackgroundUrl: '',
//           texts: [],
//           type: 'back',
//           userImages: null,
//           userTextZones: [],
//         },
//       ],
//       name: 'PGM1270',
//       openOrientation: 'right',
//       parentDimensions: {
//         height: 179,
//         width: 125,
//       },
//     },
//   },
// };
const prjDt = {
  project_id: '63ad8fab-712d-4af8-a0ed-69a9e0b4acca',
  account_id: '2118391361',
  name: 'test',
  product_id: '2PGM1270',
  scan_code: '0006846480',
  version: 1,
  is_digital_fulfillment: false,
  expiration_date: '2023-06-08T08:43:50.221121897Z',
  project_type_code: 'P',
  project_status_code: 'C',
  created_at: '2023-06-01T08:43:50.221146266Z',
  last_updated_at: '2023-06-01T08:43:50.221147853Z',
  layoutWidth: 290.66668701171875,
  layoutHeight: 416,
  font_collection: {
    default_size: 55,
    default_color: '#000000',
    fonts: [
      {
        id: 101,
        name: 'Simply Yours',
        url: 'https://content.stage.hallmark.com/POD_Fonts/108317.ttf',
      },
      {
        id: 102,
        name: 'Grateful for You',
        url: 'https://content.stage.hallmark.com/POD_Fonts/126056.ttf',
      },
      {
        id: 103,
        name: 'Warmest Wishes',
        url: 'https://content.stage.hallmark.com/POD_Fonts/BerdingScript.ttf',
      },
      {
        id: 104,
        name: 'Yours Always',
        url: 'https://content.stage.hallmark.com/POD_Fonts/TuesdayHMK-MGE.ttf',
      },
      {
        id: 105,
        name: 'All My Best',
        url: 'https://content.stage.hallmark.com/POD_Fonts/KrickHMK-Regular.ttf',
      },
      {
        id: 106,
        name: 'Take It Easy',
        url: 'https://content.stage.hallmark.com/POD_Fonts/JohnsonBallpointPen.ttf',
      },
      {
        id: 107,
        name: 'Hey Sunshine',
        url: 'https://content.stage.hallmark.com/POD_Fonts/AnnettePrintMGE-Regular.ttf',
      },
      {
        id: 108,
        name: 'Stay Strong',
        url: 'https://content.stage.hallmark.com/POD_Fonts/JasonPrint.ttf',
      },
      {
        id: 109,
        name: "'Til Next Time",
        url: 'https://content.stage.hallmark.com/POD_Fonts/126059.ttf',
      },
      {
        id: 110,
        name: 'Catch You Later',
        url: 'https://content.stage.hallmark.com/POD_Fonts/JohnsonPrint.ttf',
      },
      {
        id: 111,
        name: 'Keep in Touch',
        url: 'https://content.stage.hallmark.com/POD_Fonts/JenniferPrintLight.ttf',
      },
      {
        id: 112,
        name: 'Hugs to You',
        url: 'https://content.stage.hallmark.com/POD_Fonts/BrentPrint.ttf',
      },
      {
        id: 113,
        name: 'Kind Regards',
        url: 'https://content.stage.hallmark.com/POD_Fonts/TypewriteWornOneHMK.ttf',
      },
      {
        id: 114,
        name: 'Buh-Bye',
        url: 'https://content.stage.hallmark.com/POD_Fonts/AmbergerSansTextA.ttf',
      },
      {
        id: 115,
        name: 'Cheers to You',
        url: 'https://content.stage.hallmark.com/POD_Fonts/BeamNewHMK-Regular.ttf',
      },
      {
        id: 116,
        name: 'Later Gator',
        url: 'https://content.stage.hallmark.com/POD_Fonts/CrayottBookKB.ttf',
      },
      {
        id: 117,
        name: 'WHAT’S UP',
        url: 'https://content.stage.hallmark.com/POD_Fonts/AlmondMilkHMK-Regular.ttf',
      },
      {
        id: 119,
        name: 'Just Saying',
        url: 'https://content.stage.hallmark.com/POD_Fonts/SarahndipityHMK-Smooth.ttf',
      },
      {
        id: 120,
        name: 'OMG Hi',
        url: 'https://content.stage.hallmark.com/POD_Fonts/BeamNewHMK-Bold.ttf',
      },
      {
        id: 121,
        name: "How Ya Doin'",
        url: 'https://content.stage.hallmark.com/POD_Fonts/HelloOne-HMK.ttf',
      },
      {
        id: 122,
        name: 'Just a Note',
        url: 'https://content.stage.hallmark.com/POD_Fonts/AstaSlabHMK-Medium.ttf',
      },
      {
        id: 123,
        name: 'Keep Smiling',
        url: 'https://content.stage.hallmark.com/POD_Fonts/MiziletteHMK-SemiBoldUpright.ttf',
      },
      {
        id: 124,
        name: 'Sincerely',
        url: 'https://content.stage.hallmark.com/POD_Fonts/QueensHatHMK-Italic.ttf',
      },
      {
        id: 125,
        name: 'Hiya Pal',
        url: 'https://content.stage.hallmark.com/POD_Fonts/MichaelaVFHMK.ttf',
      },
      {
        id: 126,
        name: 'Be Seeing You',
        url: 'https://content.stage.hallmark.com/POD_Fonts/FieldnotesHMK-Rough.ttf',
      },
      {
        id: 127,
        name: 'Good Vibes',
        url: 'https://content.stage.hallmark.com/POD_Fonts/GretaHMK-Regular.ttf',
      },
      {
        id: 128,
        name: 'Best Wishes',
        url: 'https://content.stage.hallmark.com/POD_Fonts/BernhardFashionOnePKA.ttf',
      },
      {
        id: 129,
        name: 'Hang Loose',
        url: 'https://content.stage.hallmark.com/POD_Fonts/RittenPrintLowRiseHMK-Regular.ttf',
      },
      {
        id: 130,
        name: 'Much Appreciated',
        url: 'https://content.stage.hallmark.com/POD_Fonts/BethelHMK-Regular.ttf',
      },
    ],
  },
  product: {
    product_id: '2PGM1270',
    template_id: 'PGM1270',
    product_name: 'Personalized To the Moon and Back Love Photo Card',
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
            'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P1_Background.png',
          canvasJson: null,
          dimensions: {
            height: 2114,
            width: 1476,
          },
          editableAreas: [],
          faceId: 1,
          frameUrl:
            'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P1_Frame.png',
          isEditable: true,
          overlayBackgroundUrl: '',
          photoZones: [
            {
              height: 1045.0054,
              left: 175.74649,
              angle: 0,
              top: 346.0623,
              width: 1069.6383,
            },
          ],
          previewUrl:
            'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P1_Preview.png',
          printJson: null,
          replaceBackgroundUrl: '',
          texts: [
            {
              fontFamily: 'WHAT’S UP',
              fontId: 117,
              fontSize: 47,
              height: 266.7018,
              isFixed: true,
              isHybrid: false,
              isMultiline: false,
              left: 225.56647,
              angle: 0,
              text: 'MATTHEW.',
              textAlign: 'center',
              textColor: '#F0F0F0',
              top: 1684.741,
              width: 964.9977,
            },
          ],
          type: 'front',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P2-3_Background.png',
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
            'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P2-3_Preview.png',
          printJson: null,
          replaceBackgroundUrl: '',
          texts: [
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: -0.6644318617564391,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 4211191.404102844,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: -0.8154900046669247,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 130940.28764438066,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: -0.9455273691964677,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 664912.33154391,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 429.3997713993955,
              angle: -0.7498298570000044,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 1719.9066373603393,
              width: 4214300.858184678,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 207.16666793823242,
                y: 340.1666717529297,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 659.919148182754,
              angle: 0.3349734574750851,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 1295.0129178408963,
              width: 665403.2886543765,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 207.16666793823242,
                y: 340.1666717529297,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 101.63461538461537,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 104.27985170137937,
              angle: 0.1255302681052774,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 401.7643455358653,
              width: 3378905.454047657,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 121.28632275248451,
                y: 115.36933157547614,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 101.63461538461537,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 173.67887775673978,
              angle: 0.13255511611270698,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 445.8061155906091,
              width: 665403.2886543765,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 135.0322753611229,
                y: 124.70035473065383,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 158.4449338689028,
              angle: 0.12515420240372,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 423.7853081042951,
              width: 665403.2886543765,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 131.94859301215484,
                y: 119.66707370246789,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 101,
              fontSize: 20,
              height: 568.1277274408284,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 113.6158073215001,
              angle: 0.1529002999279077,
              text: 'Vbbb\nVhhh\nChhh\nChhh\n Bbb\nCvbb Chcvhh',
              textAlign: 'center',
              textColor: '#595959',
              top: 709.369447384788,
              width: 22285664.006453663,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 123.76192797898054,
                y: 231.9228472879718,
              },
              originalCenterPoint: {
                x: 145.33334350585938,
                y: 217.22721538946706,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 359.4723057844475,
              angle: 0.13105410813893545,
              text: 'Fhfhfhf\nHdhfhfh\nChchfhfh\nCgdhfhffgxhxh\nGdhffffh\nChchcbch',
              textAlign: 'left',
              textColor: '#595959',
              top: 706.885916464351,
              width: 4214300.858184678,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 169.78877173656423,
                y: 223.75599927177797,
              },
              originalCenterPoint: {
                x: 107.33334350585938,
                y: 70.89389222865978,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 464.89693953844676,
              angle: 0.21067914305508673,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 1503.0254593823126,
              width: 829916.5775875227,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 199.93570288403197,
                y: 360.2235862764055,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 320.940335339164,
              angle: -0.12253193964892217,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 1250.4134615384617,
              width: 665403.2886543765,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 163.91762739610658,
                y: 282.08523875135836,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 253.233943887837,
              angle: -0.7013748626585863,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 642.2997311812181,
              width: 130940.28764438066,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 140.71265442789462,
                y: 208.4151218564659,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 275.2385811594985,
              angle: 0.6583769247027891,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 3.6954611264740804,
              width: 665403.2886543765,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 146.90050217042273,
                y: 80.1083446365341,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 173.67887775673978,
              angle: 0,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 454.2756151786218,
              width: 664912.33154391,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 132.70233162567223,
                y: 113.56054109340587,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 101.63461538461537,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: 0,
              text: '',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 25804.933797185407,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: 0,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 130940.28764438066,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: 0,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 130940.28764438066,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 101.63461538461537,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 72.11932932167198,
              angle: 0,
              text: 'Gggh\nVhjj\nChhhj\n Bjjj\n Bhh\n Bhh\nVhjjj',
              textAlign: 'left',
              textColor: '#595959',
              top: 73.14580748631417,
              width: 2398359.0531511046,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 369.3690491549691,
                y: 97.72721284633556,
              },
              originalCenterPoint: {
                x: 434.61662550964496,
                y: 579.8081555950544,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 102,
              fontSize: 20,
              height: 593.9517150517751,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 319.2477007351306,
              angle: 0.48173834673926663,
              text: 'Vhhh\nChhh\nChhh\nChhh\nChh',
              textAlign: 'center',
              textColor: '#ec5403',
              top: -1.3862696427563996,
              width: 14390154.318906626,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 183.05456474305447,
                y: 108.28381387323772,
              },
              originalCenterPoint: {
                x: 505.0206945978804,
                y: 522.4215097779608,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: 0,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 3376412.3830235964,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 101.63461538461537,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: 0,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 5077.981295945663,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 516.4797522189348,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 218.00002923532884,
              angle: 0,
              text: 'Vbvbhhh\n Bhhjjjj\nChhhhj\n Vbbnn\nGhhhh\nChhhj\nChhhj\nChhh',
              textAlign: 'left',
              textColor: '#595959',
              top: 893.6522177020533,
              width: 130940.28764438066,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 504.85227333345995,
                y: 625.5623732059803,
              },
              originalCenterPoint: {
                x: 504.85227333345995,
                y: 625.5623732059803,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 101.63461538461537,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: 0,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 25785.894041973996,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 101.63461538461537,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: 238,
              angle: 0,
              text: 'Add your text here',
              textAlign: 'left',
              textColor: '#595959',
              top: 976,
              width: 5077.981295945663,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              originalCenterPoint: {
                x: 150.66667683919272,
                y: 214.8728992977593,
              },
              isDeleted: true,
            },
            {
              fontFamily: 'Just a Note',
              fontId: 125,
              fontSize: 16,
              height: 902.8541666666665,
              isFixed: false,
              isHybrid: false,
              isMultiline: true,
              left: -26.05502738917447,
              angle: -0.7363805534288481,
              text: 'Vjvjcjcj\nHfjfjgj\nFhchcgj\nChcjccj\nHchchch\nChcjcjc\nHchchc\nChhh\n',
              textAlign: 'left',
              textColor: '#595959',
              top: 356.02884615384625,
              width: 989.1680833299195,
              userDefined: true,
              insideWidth: 0,
              sliderIndex: 1,
              horizontalLayoutWidth: 0,
              centerPoint: {
                x: 144.1709538287301,
                y: 219.270092828337,
              },
              originalCenterPoint: {
                x: 151.2023468844613,
                y: 299.0605487228004,
              },
              multiplierX: 0.19692864973693683,
              multiplierY: 0.1967833491012299,
            },
          ],
          type: 'inside',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P4_Background.png',
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
            'https://content.stage.hallmark.com/webassets/PGM1270/PGM1270_P4_Preview.png',
          printJson: null,
          replaceBackgroundUrl: '',
          texts: [],
          type: 'back',
          userImages: null,
          userTextZones: [],
        },
      ],
      name: 'PGM1270',
      openOrientation: 'right',
      parentDimensions: {
        height: 179,
        width: 125,
      },
    },
  },
};
const loadFont = () => {
  const fontLoadPromises = [];
  prjDt.font_collection.fonts.forEach((font) => {
    const ftl = new FontFace(`fontid-${font.id}`, `url(${font.url})`);
    fontLoadPromises.push(ftl.load());
  });
  Promise.all(fontLoadPromises)
    .then((r) => {
      // console.log(r);
      if (Array.isArray(r) && r.length) {
        r.forEach((lFont) => {
          document.fonts.add(lFont);
        });
      }
      document.fonts.ready.then(function (font_face_set) {
        // all fonts have been loaded
        console.log('all fonts have been loaded');
        loadCanvasObj();
      });
    })
    .catch((r) => {
      // console.log(r);
      document.fonts.ready.then(function (font_face_set) {
        // all fonts have been loaded
        // console.log(font_face_set);
        loadCanvasObj();
      });
    });
};
function loadCanvasObj() {
  const finalProjectData = getCanvasJSON(prjDt);
  console.log({ finalProjectData, prjDt });

  finalProjectData.personalization.forEach((finalJson, index) => {
    if (index == 0) {
      const fcanvas = new fabric.Canvas(document.querySelector('#fCanvas'), {
        width: finalJson.canvasDimensions.width,
        height: finalJson.canvasDimensions.height,
      });
      console.log(finalJson);
      fcanvas.loadFromJSON(finalJson.canvasJson, () => {
        console.log(fcanvas);
        fcanvas.renderAll.bind(fcanvas);
      });
    }

    if (index == 1) {
      const icanvasEle = document.querySelector('#iCanvas');
      const icanvas = new fabric.Canvas(icanvasEle, {
        width: finalJson.canvasDimensions.width,
        height: finalJson.canvasDimensions.height,
      });
      console.log(finalJson);
      icanvas.loadFromJSON(finalJson.canvasJson, () => {
        console.log(icanvas);
        icanvas.renderAll.bind(icanvas);
        if (
          finalJson.cardFormat === 'portrait' &&
          !icanvasEle.parentElement.querySelector('.dividerV')
        ) {
          const ele = document.createElement('div');
          ele.setAttribute('class', 'dividerV');
          icanvasEle.parentElement.appendChild(ele);
        }
        if (
          finalJson.cardFormat !== 'portrait' &&
          !icanvasEle.parentElement.querySelector('.dividerH')
        ) {
          const ele = document.createElement('div');
          ele.setAttribute('class', 'dividerH');
          icanvasEle.parentElement.appendChild(ele);
        }
      });
    }

    // if (index == 2) {
    //   const bcanvas = new fabric.Canvas(document.querySelector('#bCanvas'), {
    //     width: finalJson.canvasDimensions.width,
    //     height: finalJson.canvasDimensions.height,
    //   });
    //   console.log(finalJson);
    //   bcanvas.loadFromJSON(finalJson.canvasJson, () => {
    //     console.log(bcanvas);
    //     bcanvas.renderAll.bind(bcanvas);
    //   });
    // }
  });
}
loadFont();
