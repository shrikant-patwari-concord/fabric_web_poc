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
    function stripEmojiesWithChar(str, char) {
      return str.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        char
      );
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
      stripEmojiesWithChar,
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
        left: zone.left + 18 + 9,
        top: zone.top + 18 + 9,
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

        const objLeftTop = {
          x: left,
          y: top,
        };
        const imageCenterPoint = {
          x: left + photoZoneWidth / 2,
          y: top + photoZoneHeight / 2,
        };

        if (photoZoneAngle) {
          const phtoZoneCenter = helperStore.rotatePoint(
            imageCenterPoint,
            objLeftTop,
            helperStore.degreesToRadians(photoZoneAngle)
          );
          imageCenterPoint.x = phtoZoneCenter.x;
          imageCenterPoint.y = phtoZoneCenter.y;
          objLeftTop.x = imageCenterPoint.x - (imageWidth * scaleX) / 2;
          objLeftTop.y = imageCenterPoint.y - (imageHeight * scaleY) / 2;
          const rotatePoint = helperStore.rotatePoint(
            objLeftTop,
            imageCenterPoint,
            helperStore.degreesToRadians(photoZoneAngle)
          );
          objLeftTop.x = rotatePoint.x;
          objLeftTop.y = rotatePoint.y;
        } else {
          objLeftTop.x = imageCenterPoint.x - (imageWidth * scaleX) / 2;
          objLeftTop.y = imageCenterPoint.y - (imageHeight * scaleY) / 2;
        }

        if (zone.image.angle) {
          imageAngle =
            photoZoneAngle + helperStore.radToDegree(zone.image.angle);
          const rotatePoint = helperStore.rotatePoint(
            {
              x: imageCenterPoint.x - (imageWidth * scaleX) / 2,
              y: imageCenterPoint.y - (imageHeight * scaleY) / 2,
            },
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

    const objLeftTop = {
      x: left + textZone.left,
      y: top + textZone.top,
    };
    const textObj = {
      type: 'textbox',
      version: '5.2.1',
      originX: 'left',
      originY: isPredefinedText ? 'center' : 'top',
      left: objLeftTop.x + (isPredefinedText ? 18 : 0),
      top: isPredefinedText
        ? objLeftTop.y + textZone.height / 2 + 18
        : objLeftTop.y,
      width: textZone.width + (isPredefinedText ? 18 : 0),
      height: textZone.height + (isPredefinedText ? 18 : 0),
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
      backgroundColor: 'transparent',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      fontFamily: `fontid-${textZone.fontId}`,
      fontWeight: 'normal',
      fontSize: isPredefinedText
        ? textZone.fontSize * 4
        : (textZone.fontSize - textZone.fontSize / activeFace.multiplierX) * 4,
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
      padding: 5,
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

const prjDt = {
  project_id: 'b9ea76ad-2129-4301-b696-f715bf6cdea3',
  account_id: '2118412763',
  name: 'test',
  product_id: '2PGM1214',
  scan_code: '0006848543',
  version: 1,
  layoutWidth: 290,
  layoutHeight: 416,
  is_digital_fulfillment: false,
  expiration_date: '2023-06-16T10:21:39.453989631Z',
  project_type_code: 'P',
  project_status_code: 'C',
  created_at: '2023-06-09T10:21:39.454007871Z',
  last_updated_at: '2023-06-09T10:21:39.45400884Z',
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
    product_id: '2PGM1214',
    template_id: 'PGM1214',
    product_name: 'Personalized All About Amazing You Birthday Photo Card',
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
            'https://content.stage.hallmark.com/webassets/PGM1214/PGM1214_P1_Background.png',
          canvasJson: null,
          dimensions: {
            height: 2114,
            width: 1476,
          },
          editableAreas: [],
          faceId: 1,
          frameUrl:
            'https://content.stage.hallmark.com/webassets/PGM1214/PGM1214_P1_Frame.png',
          isEditable: true,
          overlayBackgroundUrl: '',
          photoZones: [
            {
              height: 715.99817,
              left: -35.433,
              angle: 0,
              top: 1362.5642,
              width: 749.9985,
              image: {
                playableDuration: null,
                height: 2776,
                width: 2082,
                filename: 'IMG_0071.JPG',
                extension: 'jpg',
                fileSize: 2137432,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-stage-us-west-2-consumer-images/images/da678da0-589b-46a7-8aa3-e67dc764a1ed5623456527749708912.JPG',
                type: 'image',
                localUrl: 'ph://878A5DA8-5635-41B7-A032-1E0D3D282DD7/L0/001',
                imageId: '5a3794e3-d013-41b0-ad0a-45c4e3c67860',
                photoTrayId: '66fa8b4e-2c73-4a9d-aabc-939005115c21',
                sliderIndex: 0,
                centerPoint: {
                  x: 75.59253916639624,
                  y: 72.19141502365184,
                },
                insideWidth: 0,
                originalCenterPoint: {
                  x: 75.59253916639624,
                  y: 72.19141502365184,
                },
                angle: 0,
                scaleX: 1,
                scaleY: 1,
              },
            },
            {
              height: 660.999,
              left: -35.433,
              angle: 0,
              top: 689.5652,
              width: 746.9985,
              image: {
                playableDuration: null,
                height: 2776,
                width: 2082,
                filename: 'IMG_0071.JPG',
                extension: 'jpg',
                fileSize: 2137432,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-stage-us-west-2-consumer-images/images/da0dad92-c6a4-4fc9-b39a-e66369c60bc2408321712708014393.JPG',
                type: 'image',
                localUrl: 'ph://878A5DA8-5635-41B7-A032-1E0D3D282DD7/L0/001',
                imageId: '5a5cfe95-05f0-46fc-85a6-af46ecfe2513',
                photoTrayId: '8abebc46-d636-45b5-8a19-67df00de7035',
                sliderIndex: 0,
                centerPoint: {
                  x: 75.29714619179083,
                  y: 66.77995458845791,
                },
                insideWidth: 0,
                originalCenterPoint: {
                  x: 75.29714619179083,
                  y: 66.77995458845791,
                },
              },
            },
            {
              height: 709.99817,
              left: -35.433,
              angle: 0,
              top: -35.433,
              width: 750.9989,
              image: {
                playableDuration: null,
                height: 2776,
                width: 2082,
                filename: 'IMG_0071.JPG',
                extension: 'jpg',
                fileSize: 2137432,
                uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-stage-us-west-2-consumer-images/images/0657fbaf-6bb0-4b4f-a322-6a309a8dbfac7638579893216122851.JPG',
                type: 'image',
                localUrl: 'ph://878A5DA8-5635-41B7-A032-1E0D3D282DD7/L0/001',
                imageId: '724645a1-590a-45d1-8719-b24c116f3945',
                photoTrayId: '4b174f4c-ca0a-451d-b0d4-222d07696536',
                sliderIndex: 0,
                centerPoint: {
                  x: 75.69104287699464,
                  y: 71.60106497634816,
                },
                insideWidth: 0,
                originalCenterPoint: {
                  x: 75.69104287699464,
                  y: 71.60106497634816,
                },
              },
            },
          ],
          previewUrl:
            'https://content.stage.hallmark.com/webassets/PGM1214/PGM1214_P1_Preview.png',
          printJson: null,
          replaceBackgroundUrl: '',
          texts: [
            {
              fontFamily: 'Be Seeing You',
              fontId: 126,
              fontSize: 47,
              height: 205.6059,
              isFixed: true,
              isHybrid: false,
              isMultiline: false,
              left: 751.5658,
              angle: 0,
              text: 'Allison',
              textAlign: 'center',
              textColor: '#416457',
              top: 1689.7974,
              width: 595.9984,
            },
          ],
          type: 'front',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.stage.hallmark.com/webassets/PGM1214/PGM1214_P2-3_Background.png',
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
            'https://content.stage.hallmark.com/webassets/PGM1214/PGM1214_P2-3_Preview.png',
          printJson: null,
          replaceBackgroundUrl: '',
          texts: [],
          type: 'inside',
          userImages: null,
          userTextZones: [],
        },
        {
          backgroundUrl:
            'https://content.stage.hallmark.com/webassets/PGM1214/PGM1214_P4_Background.png',
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
            'https://content.stage.hallmark.com/webassets/PGM1214/PGM1214_P4_Preview.png',
          printJson: null,
          replaceBackgroundUrl: '',
          texts: [],
          type: 'back',
          userImages: null,
          userTextZones: [],
        },
      ],
      name: 'PGM1214',
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
      fcanvas.loadFromJSON(finalJson.printJson, () => {
        console.log(fcanvas);
        fcanvas.renderAll.bind(fcanvas);
      });
    }

    // if (index == 1) {
    //   const icanvasEle = document.querySelector('#iCanvas');
    //   const icanvas = new fabric.Canvas(icanvasEle, {
    //     width: finalJson.canvasDimensions.width,
    //     height: finalJson.canvasDimensions.height,
    //   });
    //   console.log(finalJson);
    //   icanvas.loadFromJSON(finalJson.canvasJson, () => {
    //     console.log(icanvas);
    //     // const react = new fabric.Rect({
    //     //   height: 527.1955815464588,
    //     //   left: 238,
    //     //   angle: 0,
    //     //   top: 976,
    //     //   width: 1000,
    //     //   strokeWidth: 1,
    //     //   fill: 'transparent',
    //     //   stroke: 'black',
    //     //   fillRule: 'nonzero',
    //     //   paintFirst: 'fill',
    //     // });
    //     // icanvas.add(react);
    //     icanvas.renderAll.bind(icanvas);
    //     if (
    //       finalJson.cardFormat === 'portrait' &&
    //       !icanvasEle.parentElement.querySelector('.dividerV')
    //     ) {
    //       const ele = document.createElement('div');
    //       ele.setAttribute('class', 'dividerV');
    //       icanvasEle.parentElement.appendChild(ele);
    //     }
    //     if (
    //       finalJson.cardFormat !== 'portrait' &&
    //       !icanvasEle.parentElement.querySelector('.dividerH')
    //     ) {
    //       const ele = document.createElement('div');
    //       ele.setAttribute('class', 'dividerH');
    //       icanvasEle.parentElement.appendChild(ele);
    //     }
    //   });
    // }

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
