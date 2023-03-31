(function () {
  const configStore = (function () {
    // general default stuff that will help us set some options
    const spacingUnit = 20; // this is the old textPadding

    const defaultFont = 'fontid-107'; // Annette Print ("Hey sunshine")
    const piBy2 = Math.PI / 2;
    const piBy180 = Math.PI / 180;
    const originXOffset = {
        left: -0.5,
        center: 0,
        right: 0.5,
      },
      originYOffset = {
        top: -0.5,
        center: 0,
        bottom: 0.5,
      };
    const bleedInMM = 3,
      mmInPixels = 11.811,
      scalingFactor = 1;

    return {
      spacingUnit: spacingUnit,
      defaultUserPhotozoneImageWidth: 200,
      multiplierWidth: 0.2269647696476965,
      multiplierHeight: 0.22705771050141912,
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
      radToDegree: function (rad) {
        return (rad || 0) / piBy180;
      },
      degreesToRadians: function (deg) {
        return (deg || 0) * piBy180;
      },
      getNonTransformedDimensions: function (obj) {
        var strokeWidth = obj.strokeWidth,
          w = obj.width + strokeWidth,
          h = obj.height + strokeWidth;
        return { x: w, y: h };
      },
      finalizeDimensions: function (obj, width, height) {
        return obj.strokeUniform
          ? { x: width + obj.strokeWidth, y: height + obj.strokeWidth }
          : { x: width, y: height };
      },
      multiplyTransformMatrices: function (a, b, is2x2) {
        // Matrix multiply a * b
        return [
          a[0] * b[0] + a[2] * b[1],
          a[1] * b[0] + a[3] * b[1],
          a[0] * b[2] + a[2] * b[3],
          a[1] * b[2] + a[3] * b[3],
          is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
          is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5],
        ];
      },
      calcDimensionsMatrix: function (options) {
        var scaleX = typeof options.scaleX === 'undefined' ? 1 : options.scaleX,
          scaleY = typeof options.scaleY === 'undefined' ? 1 : options.scaleY,
          scaleMatrix = [
            options.flipX ? -scaleX : scaleX,
            0,
            0,
            options.flipY ? -scaleY : scaleY,
            0,
            0,
          ],
          multiply = this.multiplyTransformMatrices,
          degreesToRadians = this.degreesToRadians;
        if (options.skewX) {
          scaleMatrix = multiply(
            scaleMatrix,
            [1, 0, Math.tan(degreesToRadians(options.skewX)), 1],
            true
          );
        }
        if (options.skewY) {
          scaleMatrix = multiply(
            scaleMatrix,
            [1, Math.tan(degreesToRadians(options.skewY)), 0, 1],
            true
          );
        }
        return scaleMatrix;
      },
      transformPoint: function (p, t, ignoreOffset) {
        if (ignoreOffset) {
          return { x: t[0] * p.x + t[2] * p.y, y: t[1] * p.x + t[3] * p.y };
        }
        return {
          x: t[0] * p.x + t[2] * p.y + t[4],
          y: t[1] * p.x + t[3] * p.y + t[5],
        };
      },
      arrayFind: function (array, byProperty, condition) {
        if (!array || array.length === 0) {
          return;
        }
        var i = array.length - 1,
          result = byProperty ? array[i][byProperty] : array[i];
        if (byProperty) {
          while (i--) {
            if (condition(array[i][byProperty], result)) {
              result = array[i][byProperty];
            }
          }
        } else {
          while (i--) {
            if (condition(array[i], result)) {
              result = array[i];
            }
          }
        }
        return result;
      },
      arrayMax: function (array, byProperty) {
        return this.arrayFind(array, byProperty, function (value1, value2) {
          return value1 >= value2;
        });
      },
      arrayMin: function (array, byProperty) {
        return this.arrayFind(array, byProperty, function (value1, value2) {
          return value1 < value2;
        });
      },
      makeBoundingBoxFromPoints: function (points, transform) {
        if (transform) {
          for (var i = 0; i < points.length; i++) {
            points[i] = this.transformPoint(points[i], transform);
          }
        }
        var xPoints = [points[0].x, points[1].x, points[2].x, points[3].x],
          minX = this.arrayMin(xPoints),
          maxX = this.arrayMax(xPoints),
          width = maxX - minX,
          yPoints = [points[0].y, points[1].y, points[2].y, points[3].y],
          minY = this.arrayMin(yPoints),
          maxY = this.arrayMax(yPoints),
          height = maxY - minY;
        return {
          left: minX,
          top: minY,
          width: width,
          height: height,
        };
      },
      sizeAfterTransform: function (width, height, options) {
        var dimX = width / 2,
          dimY = height / 2,
          points = [
            {
              x: -dimX,
              y: -dimY,
            },
            {
              x: dimX,
              y: -dimY,
            },
            {
              x: -dimX,
              y: dimY,
            },
            {
              x: dimX,
              y: dimY,
            },
          ],
          transformMatrix = this.calcDimensionsMatrix(options),
          bbox = this.makeBoundingBoxFromPoints(points, transformMatrix);
        return {
          x: bbox.width,
          y: bbox.height,
        };
      },
      getTransformedDimensions: function (obj, skewX, skewY) {
        if (typeof skewX === 'undefined') {
          skewX = obj.skewX;
        }
        if (typeof skewY === 'undefined') {
          skewY = obj.skewY;
        }
        var dimensions,
          dimX,
          dimY,
          noSkew = skewX === 0 && skewY === 0;
        if (obj.strokeUniform) {
          dimX = obj.width;
          dimY = obj.height;
        } else {
          dimensions = this.getNonTransformedDimensions(obj);
          dimX = dimensions.x;
          dimY = dimensions.y;
        }
        if (noSkew) {
          return this.finalizeDimensions(
            obj,
            dimX * obj.scaleX,
            dimY * obj.scaleY
          );
        }
        var bbox = this.sizeAfterTransform(dimX, dimY, {
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          skewX: skewX,
          skewY: skewY,
        });
        return this.finalizeDimensions(obj, bbox.x, bbox.y);
      },
      translateToGivenOrigin: function (
        point,
        fromOriginX,
        fromOriginY,
        toOriginX,
        toOriginY,
        obj
      ) {
        var x = point.x,
          y = point.y,
          offsetX,
          offsetY,
          dim;
        if (typeof fromOriginX === 'string') {
          fromOriginX = originXOffset[fromOriginX];
        } else {
          fromOriginX -= 0.5;
        }
        if (typeof toOriginX === 'string') {
          toOriginX = originXOffset[toOriginX];
        } else {
          toOriginX -= 0.5;
        }
        offsetX = toOriginX - fromOriginX;
        if (typeof fromOriginY === 'string') {
          fromOriginY = originYOffset[fromOriginY];
        } else {
          fromOriginY -= 0.5;
        }
        if (typeof toOriginY === 'string') {
          toOriginY = originYOffset[toOriginY];
        } else {
          toOriginY -= 0.5;
        }
        offsetY = toOriginY - fromOriginY;
        if (offsetX || offsetY) {
          dim = this.getTransformedDimensions(obj);
          x = point.x + offsetX * dim.x;
          y = point.y + offsetY * dim.y;
        }
        return { x, y };
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
      translateToCenterPoint: function (point, originX, originY, obj) {
        var p = this.translateToGivenOrigin(
          point,
          originX,
          originY,
          'center',
          'center',
          obj
        );
        if (obj.angle) {
          return this.rotatePoint(p, point, this.degreesToRadians(obj.angle));
        }
        return p;
      },
      getCenterPoint: function (obj) {
        var leftTop = { x: obj.left, y: obj.top };
        return this.translateToCenterPoint(
          leftTop,
          obj.originX,
          obj.originY,
          obj
        );
      },
      calcRotateMatrix: function (obj) {
        if (!obj.angle) {
          return [1, 0, 0, 1, 0, 0];
        }
        var theta = this.degreesToRadians(obj.angle),
          cos = this.cos(theta),
          sin = this.sin(theta);
        return [cos, sin, -sin, cos, 0, 0];
      },
      calcTranslateMatrix: function (obj) {
        var center = this.getCenterPoint(obj);
        return [1, 0, 0, 1, center.x, center.y];
      },
      calcPointRotationTransform: function (point, angle) {
        if (angle) {
          const t = this.calcRotateMatrix({ angle });
          return this.transformPoint(point, t);
        }
        return point;
      },
      helperSettings: {
        bleedInMM,
        mmInPixels,
        scalingFactor,
      },
      calcACoords: function (obj) {
        var rotateMatrix = this.calcRotateMatrix(obj),
          translateMatrix = this.calcTranslateMatrix(obj),
          finalMatrix = this.multiplyTransformMatrices(
            translateMatrix,
            rotateMatrix
          ),
          dim = this.getTransformedDimensions(obj),
          w = dim.x / 2,
          h = dim.y / 2;
        return {
          // corners
          tl: this.transformPoint({ x: -w, y: -h }, finalMatrix),
          tr: this.transformPoint({ x: w, y: -h }, finalMatrix),
          bl: this.transformPoint({ x: -w, y: h }, finalMatrix),
          br: this.transformPoint({ x: w, y: h }, finalMatrix),
        };
      },
      getBoundingRect: function (obj) {
        const aCoords = this.calcACoords(obj);
        const coords = [aCoords.tl, aCoords.tr, aCoords.br, aCoords.bl];
        return this.makeBoundingBoxFromPoints(coords);
      },
    };
  })();

  const deepCopy = (inObject) => {
    if (typeof inObject !== 'object' || inObject === null) {
      return inObject;
    }

    const outObject = Array.isArray(inObject) ? [] : {};

    Object.keys(inObject).forEach((key) => {
      const val = inObject[`${key}`];
      outObject[`${key}`] = deepCopy(val);
    });

    return outObject;
  };

  const printJsonConversion = (canvasJson) => {
    const printJSON = deepCopy(canvasJson);
    const scalingFactor = configStore.helperSettings.scalingFactor;
    const bleedInPixels =
      (configStore.helperSettings.bleedInMM *
        configStore.helperSettings.mmInPixels) /
      configStore.helperSettings.scalingFactor;
    if (printJSON.backgroundImage) {
      printJSON.backgroundImage.width *=
        scalingFactor * printJSON.backgroundImage.scaleX;
      printJSON.backgroundImage.height *=
        scalingFactor * printJSON.backgroundImage.scaleY;

      printJSON.backgroundImage.left = 0;
      printJSON.backgroundImage.top = 0;
      const imgSrc = printJSON.backgroundImage.src.split('?w=')[0];
      printJSON.backgroundImage.src = `${imgSrc}?w=${printJSON.backgroundImage.width}`;
    }
    printJSON.objects = printJSON.objects.map((canvasObject) => {
      if (canvasObject.type === 'textbox') {
        canvasObject.fontSize *= scalingFactor;
        canvasObject.width *= scalingFactor;
        canvasObject.height *= scalingFactor;
      } else {
        canvasObject.scaleX *= scalingFactor;
        canvasObject.scaleY *= scalingFactor;

        if (canvasObject.src) {
          canvasObject.src = canvasObject.src.split('?w=')[0];
        }
      }

      if (canvasObject.clipPath) {
        canvasObject.clipPath.scaleX *= scalingFactor;
        canvasObject.clipPath.scaleY *= scalingFactor;
        canvasObject.clipPath.left =
          (canvasObject.clipPath.left + bleedInPixels) * scalingFactor;
        canvasObject.clipPath.top =
          (canvasObject.clipPath.top + bleedInPixels) * scalingFactor;
      }

      canvasObject.left = (canvasObject.left + bleedInPixels) * scalingFactor;
      canvasObject.top = (canvasObject.top + bleedInPixels) * scalingFactor;
      return canvasObject;
    });
    return printJSON;
  };

  const loadLayer = async (layer, faceNumber, preview) => {
    let { backgroundUrl, frameUrl } = layer;

    let canvasJson = {
      version: '3.6.6',
      objects: [],
      selectionColor: 'rgba(100, 100, 255, 0.3)',
      hoverCursor: 'move',
    };

    if (backgroundUrl) {
      canvasJson.backgroundImage = {
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
      };
    }

    const userImages = [];
    await Promise.all(
      layer.photoZones.map((d) => {
        if (typeof d.deleted === 'undefined' || d.deleted === false) {
          if (typeof d.userDefined === 'undefined' || d.userDefined === false) {
            canvasJson.objects.push(
              Object.assign({}, configStore.photozoneDefaultSettings, {
                type: 'rect',
                version: '3.6.6',
                left: (d.left || 0) + 17.7165,
                top: (d.top || 0) + 17.7165,
                width: (d.width || layer.dimensions.width) + 17.7165,
                height: (d.height || layer.dimensions.height) + 17.7165,
                angle: configStore.radToDegree(d.angle),
                fill: configStore.rectFillColor,
                stroke: null,
                strokeWidth: 1,
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
                rx: 0,
                ry: 0,
                inverted: false,
              })
            );
          }
          if (d.image && d.image.uri) {
            d.image.imageId && userImages.push(d.image.imageId);
            let scaleX = 1,
              scaleY = 1,
              iScaleX = d.image.scaleX || 1,
              iScaleY = d.image.scaleY || 1,
              left = d.left || 0,
              top = d.top || 0,
              cropRectWidth =
                d.image && d.image.cropRect && d.image.cropRect.width
                  ? d.image.cropRect.width
                  : undefined,
              cropReactHeight =
                d.image && d.image.cropRect && d.image.cropRect.height
                  ? d.image.cropRect.height
                  : undefined,
              imageWidth = cropRectWidth || d.image.width || 0,
              imageHeight = cropReactHeight || d.image.height || 0;
            if (typeof d.userDefined === 'undefined') {
              const canvasWidth = d.width || layer.dimensions.width || 0,
                canvasHeight = d.height || layer.dimensions.height || 0,
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
              left +=
                (d.image.left || 0) +
                17.7165 +
                (d.image.translateX || 0) / 2 / configStore.multiplierWidth;
              top +=
                (d.image.top || 0) +
                17.7165 +
                (d.image.translateY || 0) / 2 / configStore.multiplierHeight;
            } else if (d.userDefined) {
              const canvasWidth = layer.dimensions.width || 0,
                canvasHeight = layer.dimensions.height || 0;
              scaleX = scaleY =
                (configStore.defaultUserPhotozoneImageWidth / imageWidth) *
                (1 / configStore.multiplierWidth);
              left =
                (d.image.insideWidth || 0) +
                (canvasWidth / 2 - imageWidth * scaleX) / 2;
              top = (canvasHeight - imageHeight * scaleY) / 2;
              scaleX = scaleX * iScaleX;
              scaleY = scaleY * iScaleY;
              left =
                (d.image.insideWidth || 0) +
                (canvasWidth / 2 - imageWidth * scaleX) / 2;
              top = (canvasHeight - imageHeight * scaleY) / 2;
              left = left + (d.image.left || 0) / configStore.multiplierWidth;
              top = top + (d.image.top || 0) / configStore.multiplierHeight;
            }

            let point = {
              x: left,
              y: top,
            };

            const fImageObj = {
              type: 'image',
              version: '3.6.6',
              left: point.x,
              top: point.y,
              scaleX: scaleX || 1,
              scaleY: scaleY || 1,
              userAddedPhotoId: d.image.imageId,
              angle: configStore.radToDegree(d.image.angle),
              originX: 'left',
              originY: 'top',
              centeredRotation: true,
              centeredScaling: true,
              width: imageWidth + (d.userDefined ? 0 : 17.7165),
              height: imageHeight + (d.userDefined ? 0 : 17.7165),
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
              src: d.image.uri,
              crossOrigin: 'anonymous',
              filters: [],
              shadow:
                typeof d.userDefined === 'boolean'
                  ? {
                      color: 'rgba(0, 0, 0, 0.25)',
                      blur: 50,
                      offsetX: 0,
                      offsetY: 15 / configStore.multiplierHeight,
                    }
                  : null,
              clipPath:
                typeof d.userDefined === 'undefined'
                  ? {
                      type: 'rect',
                      version: '3.6.6',
                      left: (d.left || 0) + (d.userDefined ? 0 : 17.7165),
                      top: (d.top || 0) + (d.userDefined ? 0 : 17.7165),
                      width:
                        (d.width || layer.dimensions.width) +
                        (d.userDefined ? 0 : 17.7165),
                      height:
                        (d.height || layer.dimensions.height) +
                        (d.userDefined ? 0 : 17.7165),
                      angle: configStore.radToDegree(d.angle),
                      fill: 'rgb(0,0,0)',
                      stroke: null,
                      strokeWidth: 1,
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
                      rx: 0,
                      ry: 0,
                      inverted: false,
                      absolutePositioned: true,
                    }
                  : undefined,
            };

            if (d.image.angle) {
              const centerPoint = {
                x:
                  point.x +
                  ((imageWidth + (d.userDefined ? 0 : 17.7165)) * scaleX) / 2,
                y:
                  point.y +
                  ((imageHeight + (d.userDefined ? 0 : 17.7165)) * scaleY) / 2,
              };
              const rotatePoint = configStore.rotatePoint(
                point,
                centerPoint,
                d.image.angle
              );
              fImageObj.left = rotatePoint.x;
              fImageObj.top = rotatePoint.y;
              console.log(rotatePoint, centerPoint, point);
            }

            canvasJson.objects.push(fImageObj);
          }
        }
      })
    );

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
      if (typeof d.isDeleted === 'undefined' || d.isDeleted === false) {
        let point = {
          x:
            (d.left || 0) +
            17.7165 +
            (d.translateX || 0) / 2 / configStore.multiplierWidth,
          y:
            (d.top || 0) +
            17.7165 +
            (d.translateY || 0) / 2 / configStore.multiplierWidth,
        };
        const textObj = Object.assign({}, configStore.textDefaultSettings, {
          type: 'textbox',
          version: '3.6.6',
          originX: 'left',
          originY: 'top',
          left: point.x,
          top: point.y,
          width: d.width + 17.7165,
          height: d.height + 17.7165,
          fill: d.textColor,
          angle: d.angle,
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
        });
        // const boudingBox = configStore.getBoundingRect(textObj);
        // console.log({ faceNumber, boudingBox });
        // textObj.left = boudingBox.tl.x + (d.translateX || 0) / configStore.multiplierWidth;
        // textObj.top =
        //   boudingBox.tl.y +
        //   (boudingBox.bl.y - boudingBox.tl.y) +
        //   (d.translateY || 0) / configStore.multiplierWidth;
        canvasJson.objects.push(textObj);
      }
    });

    return {
      CanvasJson: canvasJson,
      PrintJson: printJsonConversion(canvasJson),
      UserImages: userImages,
      FaceId: faceNumber,
      FaceNumber: faceNumber,
    };
  };

  // const jsonData = {
  //   project_id: 'd838d126-20e2-451a-963e-4ca2c92b00ce',
  //   account_id: '2125483729',
  //   name: 'test',
  //   product_id: '2PGM1207',
  //   scan_code: '0002390336',
  //   version: 1,
  //   is_digital_fulfillment: false,
  //   expiration_date: '2023-03-31T13:40:39.480107952Z',
  //   project_type_code: 'P',
  //   project_status_code: 'C',
  //   created_at: '2023-03-24T13:40:39.480136355Z',
  //   last_updated_at: '2023-03-24T13:40:39.480137712Z',
  //   font_collection: {
  //     default_size: 55,
  //     default_color: '#000000',
  //     fonts: [
  //       {
  //         id: 101,
  //         name: 'Simply Yours',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/108317.ttf',
  //       },
  //       {
  //         id: 102,
  //         name: 'Grateful for You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/126056.ttf',
  //       },
  //       {
  //         id: 103,
  //         name: 'Warmest Wishes',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BerdingScript.ttf',
  //       },
  //       {
  //         id: 104,
  //         name: 'Yours Always',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/TuesdayHMK-MGE.ttf',
  //       },
  //       {
  //         id: 105,
  //         name: 'All My Best',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/KrickHMK-Regular.ttf',
  //       },
  //       {
  //         id: 106,
  //         name: 'Take It Easy',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JohnsonBallpointPen.ttf',
  //       },
  //       {
  //         id: 107,
  //         name: 'Hey Sunshine',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AnnettePrintMGE-Regular.ttf',
  //       },
  //       {
  //         id: 108,
  //         name: 'Stay Strong',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JasonPrint.ttf',
  //       },
  //       {
  //         id: 109,
  //         name: "'Til Next Time",
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/126059.ttf',
  //       },
  //       {
  //         id: 110,
  //         name: 'Catch You Later',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JohnsonPrint.ttf',
  //       },
  //       {
  //         id: 111,
  //         name: 'Keep in Touch',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JenniferPrintLight.ttf',
  //       },
  //       {
  //         id: 112,
  //         name: 'Hugs to You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BrentPrint.ttf',
  //       },
  //       {
  //         id: 113,
  //         name: 'Kind Regards',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/TypewriteWornOneHMK.ttf',
  //       },
  //       {
  //         id: 114,
  //         name: 'Buh-Bye',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AmbergerSansTextA.ttf',
  //       },
  //       {
  //         id: 115,
  //         name: 'Cheers to You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BeamNewHMK-Regular.ttf',
  //       },
  //       {
  //         id: 116,
  //         name: 'Later Gator',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/CrayottBookKB.ttf',
  //       },
  //       {
  //         id: 117,
  //         name: 'WHAT’S UP',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AlmondMilkHMK-Regular.ttf',
  //       },
  //       {
  //         id: 119,
  //         name: 'Just Saying',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/SarahndipityHMK-Smooth.ttf',
  //       },
  //       {
  //         id: 120,
  //         name: 'OMG Hi',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BeamNewHMK-Bold.ttf',
  //       },
  //       {
  //         id: 121,
  //         name: "How Ya Doin'",
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/HelloOne-HMK.ttf',
  //       },
  //       {
  //         id: 122,
  //         name: 'Just a Note',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AstaSlabHMK-Medium.ttf',
  //       },
  //       {
  //         id: 123,
  //         name: 'Keep Smiling',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/MiziletteHMK-SemiBoldUpright.ttf',
  //       },
  //       {
  //         id: 124,
  //         name: 'Sincerely',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/QueensHatHMK-Italic.ttf',
  //       },
  //       {
  //         id: 125,
  //         name: 'Hiya Pal',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/MichaelaVFHMK.ttf',
  //       },
  //       {
  //         id: 126,
  //         name: 'Be Seeing You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/FieldnotesHMK-Rough.ttf',
  //       },
  //       {
  //         id: 127,
  //         name: 'Good Vibes',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/GretaHMK-Regular.ttf',
  //       },
  //       {
  //         id: 128,
  //         name: 'Best Wishes',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BernhardFashionOnePKA.ttf',
  //       },
  //       {
  //         id: 129,
  //         name: 'Hang Loose',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/RittenPrintLowRiseHMK-Regular.ttf',
  //       },
  //       {
  //         id: 130,
  //         name: 'Much Appreciated',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BethelHMK-Regular.ttf',
  //       },
  //     ],
  //   },
  //   product: {
  //     product_id: '2PGM1207',
  //     template_id: 'PGM1207',
  //     product_name: 'Personalized Full Photo Birthday Photo Card, 5x7 Vertical',
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
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Background.png',
  //           canvasJson: null,
  //           dimensions: {
  //             height: 2114,
  //             width: 1476,
  //           },
  //           editableAreas: [],
  //           faceId: 1,
  //           frameUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Frame.png',
  //           isEditable: true,
  //           overlayBackgroundUrl: '',
  //           photoZones: [
  //             {
  //               height: 1951.7098,
  //               left: 21.259802,
  //               angle: 0,
  //               top: 45.70975,
  //               width: 1363.6118,
  //               image: {
  //                 playableDuration: null,
  //                 height: 4032,
  //                 width: 3024,
  //                 filename: 'IMG_4072.JPG',
  //                 extension: 'jpg',
  //                 fileSize: 1744579,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/38c7d840-8f56-40e3-a70b-01f7fead1c398466342204829421918.JPG',
  //                 type: 'image',
  //                 localUrl: 'ph://CE01E3CA-F0E8-4B89-BA86-20DD4168590A/L0/001',
  //                 imageId: '3732c7ea-ce72-4eb0-be84-fc186a307ae7',
  //                 photoTrayId: '6a835ed6-0749-4e9e-97c6-a280eadf61ca',
  //                 sliderIndex: 0,
  //                 scaleX: 1.533541341653666,
  //                 scaleY: 1.533541341653666,
  //                 scale: 0.7134649970499101,
  //                 angle: 0,
  //               },
  //             },
  //           ],
  //           previewUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Preview.png',
  //           replaceBackgroundUrl: '',
  //           texts: [
  //             {
  //               fontFamily: 'OMG Hi',
  //               fontId: 120,
  //               fontSize: 26,
  //               height: 184.72404,
  //               isFixed: true,
  //               isHybrid: false,
  //               isMultiline: false,
  //               left: 170.5662,
  //               angle: 0,
  //               text: 'RYLEIGH',
  //               textAlign: 'center',
  //               textColor: '#FFFFFF',
  //               top: 1693.4612,
  //               width: 1063.9987,
  //             },
  //           ],
  //           type: 'front',
  //           userImages: null,
  //           userTextZones: [],
  //         },
  //         {
  //           backgroundUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Background.png',
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
  //           photoZones: [
  //             {
  //               left: 67.5,
  //               top: 106.66666666666666,
  //               image: {
  //                 playableDuration: null,
  //                 height: 4032,
  //                 width: 3024,
  //                 filename: 'IMG_4223.HEIC',
  //                 extension: 'heic',
  //                 fileSize: 891586,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/adec519b-14c1-4ff7-aaa8-0ce6c64bcaf75061698421704624730.JPEG',
  //                 type: 'image',
  //                 localUrl: 'ph://73A40F90-CA77-4210-A38E-43DF6358DA97/L0/001',
  //                 imageId: 'b6d799ce-4c84-4a1b-a8ae-cba6cf725e87',
  //                 photoTrayId: 'b1412bff-6fe0-4a42-ad91-bbad348f0831',
  //                 sliderIndex: 1,
  //                 scaleX: 1.452418096723869,
  //                 scaleY: 1.452418096723869,
  //                 left: -18.750000000000142,
  //                 top: 31.000000000000057,
  //                 angle: 1.5707963267948966,
  //               },
  //               userDefined: true,
  //               deleted: true,
  //             },
  //             {
  //               left: 67.5,
  //               top: 106.66666666666666,
  //               image: {
  //                 playableDuration: null,
  //                 height: 4032,
  //                 width: 3024,
  //                 filename: 'IMG_4209.HEIC',
  //                 extension: 'heic',
  //                 fileSize: 441296,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/1c318406-9c55-4d1e-83d8-4c0621281ddf3988704659030331921.JPEG',
  //                 type: 'image',
  //                 localUrl: 'ph://284EE1D7-CD3D-4888-8EB0-265257B87813/L0/001',
  //                 imageId: '199031f6-dfc5-4608-9a37-21689d20b171',
  //                 photoTrayId: 'ce9c69fc-5924-4cb6-afe7-19da690d278e',
  //                 sliderIndex: 1,
  //                 scaleX: 0.641185647425897,
  //                 scaleY: 0.641185647425897,
  //                 left: -24,
  //                 top: -79,
  //                 angle: -0.6283185307179586,
  //               },
  //               userDefined: true,
  //               deleted: true,
  //             },
  //             {
  //               left: 67.5,
  //               top: 106.66666666666666,
  //               image: {
  //                 playableDuration: null,
  //                 height: 4032,
  //                 width: 3024,
  //                 filename: 'IMG_4234.HEIC',
  //                 extension: 'heic',
  //                 fileSize: 2312788,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/22e4ff25-5482-46fa-98de-25b8937fb3b61461907133103237534.JPEG',
  //                 type: 'image',
  //                 localUrl: 'ph://06FD1567-7539-4BF8-8FD9-C5D3B79E1813/L0/001',
  //                 imageId: 'd78ad6c2-b472-4b18-ab4b-3826d6af3848',
  //                 photoTrayId: 'f1263d12-07af-4c39-9839-6e3edf344c21',
  //                 sliderIndex: 1,
  //                 scaleX: 0.53198127925117,
  //                 scaleY: 0.53198127925117,
  //                 left: 4.499999999999972,
  //                 top: -68.00000000000011,
  //                 angle: -1.0122909661567112,
  //               },
  //               userDefined: true,
  //               deleted: true,
  //             },
  //             {
  //               left: 67.5,
  //               top: 165,
  //               image: {
  //                 playableDuration: null,
  //                 height: 2316,
  //                 width: 3088,
  //                 filename: 'IMG_4220.HEIC',
  //                 extension: 'heic',
  //                 fileSize: 1217427,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/74c38317-1674-4022-a5ac-ceea299707782221029477208656602.JPEG',
  //                 type: 'image',
  //                 localUrl: 'ph://1AA3E876-7850-4DBC-B117-6C46F11A1090/L0/001',
  //                 imageId: 'd1ef94e8-bc2d-4553-9efa-1adbb7b71e2c',
  //                 photoTrayId: '03c2aeeb-d4a9-498a-b9e0-673bff032eb9',
  //                 sliderIndex: 1,
  //                 scaleX: 1.28393135725429,
  //                 scaleY: 1.28393135725429,
  //                 angle: 0,
  //               },
  //               userDefined: true,
  //               deleted: true,
  //             },
  //             {
  //               left: 67.5,
  //               top: 106.66666666666666,
  //               image: {
  //                 playableDuration: null,
  //                 height: 4032,
  //                 width: 3024,
  //                 filename: 'IMG_4199.HEIC',
  //                 extension: 'heic',
  //                 fileSize: 1230569,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/fae80ecf-ada6-4dce-b6c9-bd6a59aa32252321201417772035573.JPEG',
  //                 type: 'image',
  //                 localUrl: 'ph://8080CB13-C3DB-41EE-BF13-88BEC4752FD4/L0/001',
  //                 imageId: '4d34a67d-b3a9-431c-be2e-ce415194a16e',
  //                 photoTrayId: 'd4151740-2c80-4e77-a1da-b13f21101b70',
  //                 sliderIndex: 1,
  //                 angle: 0.7155849933176751,
  //                 left: -35.500000000000114,
  //                 top: -4,
  //               },
  //               userDefined: true,
  //               deleted: true,
  //             },
  //             {
  //               left: 67.5,
  //               top: 165,
  //               image: {
  //                 playableDuration: null,
  //                 height: 2316,
  //                 width: 3088,
  //                 filename: 'IMG_4212.HEIC',
  //                 extension: 'heic',
  //                 fileSize: 1742768,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/796cae37-9c1d-440c-96e7-fb8c2546f69e6782118396114263091.JPEG',
  //                 type: 'image',
  //                 localUrl: 'ph://6C9726C3-965C-4DDD-8556-64E04E79313B/L0/001',
  //                 imageId: 'c40a9a4e-d1a4-4462-ac47-a5bb6ab4a47b',
  //                 photoTrayId: 'fb230b16-e4d7-44fd-ad56-32545162e2ed',
  //                 sliderIndex: 1,
  //                 angle: -0.5410520681182421,
  //               },
  //               userDefined: true,
  //               deleted: true,
  //             },
  //             {
  //               left: 67.5,
  //               top: 106.66666666666666,
  //               image: {
  //                 playableDuration: null,
  //                 height: 4032,
  //                 width: 3024,
  //                 filename: 'IMG_4204.HEIC',
  //                 extension: 'heic',
  //                 fileSize: 938926,
  //                 uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/bbca785b-51fd-41b4-9ae5-2a6763fae21d5780153913936597818.JPEG',
  //                 type: 'image',
  //                 localUrl: 'ph://86FF1CC3-F77F-44B5-BF83-1600BA0DACB9/L0/001',
  //                 imageId: 'e9b36643-e134-47ae-945c-5b6dc8d0b355',
  //                 photoTrayId: 'd0115f54-8069-4afb-ac71-90a7e98ec494',
  //                 sliderIndex: 1,
  //                 scaleX: 0.7004680187207488,
  //                 scaleY: 0.7004680187207488,
  //                 left: 11.500000000000028,
  //                 top: -106.5,
  //                 angle: 0,
  //               },
  //               userDefined: true,
  //             },
  //           ],
  //           previewUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Preview.png',
  //           replaceBackgroundUrl: '',
  //           texts: [],
  //           type: 'inside',
  //           userImages: null,
  //           userTextZones: [],
  //         },
  //         {
  //           backgroundUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Background.png',
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
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Preview.png',
  //           replaceBackgroundUrl: '',
  //           texts: [],
  //           type: 'back',
  //           userImages: null,
  //           userTextZones: [],
  //         },
  //       ],
  //       name: 'PGM1207',
  //       openOrientation: 'right',
  //       parentDimensions: {
  //         height: 179,
  //         width: 125,
  //       },
  //     },
  //   },
  // };

  // jsonData.variables.template_data.faces.forEach(async (face, index) => {
  //   const finalJson = await loadLayer(face, index + 1, false);
  //   if (index == 0) {
  //     const fcanvas = new fabric.Canvas(
  //       document.querySelector('#fCanvas'),
  //       face.dimensions
  //     );
  //     console.log(finalJson);
  //     fcanvas.loadFromJSON(finalJson.CanvasJson, () => {
  //       console.log(fcanvas);
  //       fcanvas.renderAll.bind(fcanvas);
  //     });
  //   }
  //   if (index == 1) {
  //     const icanvas = new fabric.Canvas(
  //       document.querySelector('#iCanvas'),
  //       face.dimensions
  //     );
  //     console.log(finalJson);
  //     icanvas.loadFromJSON(finalJson.CanvasJson, () => {
  //       console.log(icanvas);
  //       icanvas.renderAll.bind(icanvas);
  //     });
  //   }
  // });

  // var initialData = {
  //   project_id: '0dfc54d9-5144-4e6b-ab8b-2508bc7a3850',
  //   account_id: '2125445574',
  //   name: 'POD Project',
  //   product_id: '2PGM1207',
  //   scan_code: '0002391308',
  //   version: 1,
  //   is_digital_fulfillment: false,
  //   expiration_date: '2023-04-05T10:57:35Z',
  //   project_type_code: 'P',
  //   project_status_code: 'C',
  //   created_at: '2023-03-29T10:57:35Z',
  //   last_updated_at: '2023-03-29T11:00:35Z',
  //   addresses: [
  //     {
  //       first_name: 'Shrikant',
  //       last_name: 'Patwari',
  //       company_name: '',
  //       address_line_1: '202 W Superior St',
  //       address_line_2: '',
  //       city: 'Fort Wayne',
  //       state_code: 'IN',
  //       zip: '46802',
  //       country_code: 'USA',
  //       address_id: '1266d4b6-b4a1-4948-9509-026d409dd904',
  //       address_type_code: 'S',
  //       created_at: '2023-03-29T11:13:40Z',
  //       last_updated_at: '2023-03-29T11:13:40Z',
  //       is_verified: true,
  //     },
  //     {
  //       first_name: 'Shrikant',
  //       last_name: 'Patwari',
  //       company_name: '',
  //       address_line_1: '202 W Superior St',
  //       address_line_2: 'Fort Wayne',
  //       city: 'Fort Wayne',
  //       state_code: 'IN',
  //       zip: '46802',
  //       country_code: 'USA',
  //       address_id: 'a48b44ec-84e8-4753-8cdd-061f5798fc0f',
  //       address_type_code: 'R',
  //       created_at: '2023-03-29T11:13:40Z',
  //       last_updated_at: '2023-03-29T11:13:40Z',
  //       is_verified: true,
  //     },
  //   ],
  //   images: [
  //     {
  //       image_id: '09464558-07f5-4025-b8a7-2cc5e56b72d0',
  //       image_reference_id: '09cafbf5-83b9-4b8f-a2c2-977ee8e55fb6',
  //       image_url:
  //         'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/145128da-ed24-477b-8044-c6d794972bb74961356203726284973.jpg',
  //       created_at: '2023-03-29T11:01:31Z',
  //       last_updated_at: '2023-03-29T11:01:31Z',
  //     },
  //     {
  //       image_id: '9a7b56b7-26a9-428b-9fe7-f726c9a89589',
  //       image_reference_id: '872e0498-68d6-4faa-832f-4f63ab8fd7fc',
  //       image_url:
  //         'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/b74d1bd7-6798-41b6-b53b-a4b7d4bdd0c46158972322187069841.jpg',
  //       created_at: '2023-03-29T11:04:03Z',
  //       last_updated_at: '2023-03-29T11:04:03Z',
  //     },
  //   ],
  //   font_collection: {
  //     default_size: 55,
  //     default_color: '#000000',
  //     fonts: [
  //       {
  //         id: 101,
  //         name: 'Simply Yours',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/108317.ttf',
  //       },
  //       {
  //         id: 102,
  //         name: 'Grateful for You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/126056.ttf',
  //       },
  //       {
  //         id: 103,
  //         name: 'Warmest Wishes',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BerdingScript.ttf',
  //       },
  //       {
  //         id: 104,
  //         name: 'Yours Always',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/TuesdayHMK-MGE.ttf',
  //       },
  //       {
  //         id: 105,
  //         name: 'All My Best',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/KrickHMK-Regular.ttf',
  //       },
  //       {
  //         id: 106,
  //         name: 'Take It Easy',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JohnsonBallpointPen.ttf',
  //       },
  //       {
  //         id: 107,
  //         name: 'Hey Sunshine',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AnnettePrintMGE-Regular.ttf',
  //       },
  //       {
  //         id: 108,
  //         name: 'Stay Strong',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JasonPrint.ttf',
  //       },
  //       {
  //         id: 109,
  //         name: "'Til Next Time",
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/126059.ttf',
  //       },
  //       {
  //         id: 110,
  //         name: 'Catch You Later',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JohnsonPrint.ttf',
  //       },
  //       {
  //         id: 111,
  //         name: 'Keep in Touch',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/JenniferPrintLight.ttf',
  //       },
  //       {
  //         id: 112,
  //         name: 'Hugs to You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BrentPrint.ttf',
  //       },
  //       {
  //         id: 113,
  //         name: 'Kind Regards',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/TypewriteWornOneHMK.ttf',
  //       },
  //       {
  //         id: 114,
  //         name: 'Buh-Bye',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AmbergerSansTextA.ttf',
  //       },
  //       {
  //         id: 115,
  //         name: 'Cheers to You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BeamNewHMK-Regular.ttf',
  //       },
  //       {
  //         id: 116,
  //         name: 'Later Gator',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/CrayottBookKB.ttf',
  //       },
  //       {
  //         id: 117,
  //         name: 'WHAT’S UP',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AlmondMilkHMK-Regular.ttf',
  //       },
  //       {
  //         id: 119,
  //         name: 'Just Saying',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/SarahndipityHMK-Smooth.ttf',
  //       },
  //       {
  //         id: 120,
  //         name: 'OMG Hi',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BeamNewHMK-Bold.ttf',
  //       },
  //       {
  //         id: 121,
  //         name: "How Ya Doin'",
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/HelloOne-HMK.ttf',
  //       },
  //       {
  //         id: 122,
  //         name: 'Just a Note',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/AstaSlabHMK-Medium.ttf',
  //       },
  //       {
  //         id: 123,
  //         name: 'Keep Smiling',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/MiziletteHMK-SemiBoldUpright.ttf',
  //       },
  //       {
  //         id: 124,
  //         name: 'Sincerely',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/QueensHatHMK-Italic.ttf',
  //       },
  //       {
  //         id: 125,
  //         name: 'Hiya Pal',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/MichaelaVFHMK.ttf',
  //       },
  //       {
  //         id: 126,
  //         name: 'Be Seeing You',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/FieldnotesHMK-Rough.ttf',
  //       },
  //       {
  //         id: 127,
  //         name: 'Good Vibes',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/GretaHMK-Regular.ttf',
  //       },
  //       {
  //         id: 128,
  //         name: 'Best Wishes',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BernhardFashionOnePKA.ttf',
  //       },
  //       {
  //         id: 129,
  //         name: 'Hang Loose',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/RittenPrintLowRiseHMK-Regular.ttf',
  //       },
  //       {
  //         id: 130,
  //         name: 'Much Appreciated',
  //         url: 'https://content.dev.hallmark.com/POD_Fonts/BethelHMK-Regular.ttf',
  //       },
  //     ],
  //   },
  //   product: {
  //     product_id: '2PGM1207',
  //     template_id: 'PGM1207',
  //     product_name: 'Personalized Full Photo Birthday Photo Card, 5x7 Vertical',
  //     vendor_lead_time: 1,
  //     envelope_color: '#FFFFF',
  //   },
  //   fulfillment: {},
  //   variables: {
  //     template_data: {
  //       CardFormat: 'portrait',
  //       CardSize: '49',
  //       CardType: 'photo',
  //       Dimensions: {
  //         Height: 179,
  //         Width: 125,
  //       },
  //       Faces: [
  //         {
  //           BackgroundUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Background.png',
  //           CanvasJson: {
  //             backgroundImage: {
  //               angle: 0,
  //               backgroundColor: '',
  //               borderDashArray: null,
  //               cornerColor: 'rgb(178,204,255)',
  //               cropX: 0,
  //               cropY: 0,
  //               crossOrigin: 'anonymous',
  //               evented: true,
  //               fill: 'transparent',
  //               fillRule: 'nonzero',
  //               filters: [],
  //               flipX: false,
  //               flipY: false,
  //               globalCompositeOperation: 'source-over',
  //               hasControls: true,
  //               height: 2112,
  //               hoverCursor: null,
  //               left: 0,
  //               lockMovementX: false,
  //               lockMovementY: false,
  //               lockRotation: false,
  //               lockScalingFlip: false,
  //               lockSkewingX: false,
  //               minScaleLimit: 0,
  //               objectCaching: true,
  //               opacity: 1,
  //               originX: 'left',
  //               originY: 'top',
  //               padding: 0,
  //               paintFirst: 'fill',
  //               scaleX: 1,
  //               scaleY: 1,
  //               selectable: true,
  //               shadow: null,
  //               skewX: 0,
  //               skewY: 0,
  //               src: 'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Background.png?w=1476',
  //               stroke: null,
  //               strokeDashArray: null,
  //               strokeDashOffset: 0,
  //               strokeLineCap: 'butt',
  //               strokeLineJoin: 'miter',
  //               strokeMiterLimit: 4,
  //               strokeUniform: false,
  //               strokeWidth: 0,
  //               top: 0,
  //               type: 'image',
  //               version: '5.2.1',
  //               visible: true,
  //               width: 1476,
  //             },
  //             hoverCursor: 'move',
  //             objects: [
  //               {
  //                 angle: 0,
  //                 backgroundColor: '',
  //                 borderDashArray: null,
  //                 clipPath: {
  //                   absolutePositioned: true,
  //                   angle: 0,
  //                   backgroundColor: '',
  //                   borderDashArray: null,
  //                   cornerColor: 'rgb(178,204,255)',
  //                   evented: true,
  //                   fill: 'rgb(0,0,0)',
  //                   fillRule: 'nonzero',
  //                   flipX: false,
  //                   flipY: false,
  //                   globalCompositeOperation: 'source-over',
  //                   hasControls: true,
  //                   height: 976,
  //                   hoverCursor: null,
  //                   inverted: false,
  //                   left: 57.433,
  //                   lockMovementX: false,
  //                   lockMovementY: false,
  //                   lockRotation: false,
  //                   lockScalingFlip: false,
  //                   lockSkewingX: false,
  //                   minScaleLimit: 0,
  //                   oCoords: null,
  //                   objectCaching: true,
  //                   opacity: 1,
  //                   originX: 'left',
  //                   originY: 'top',
  //                   padding: 0,
  //                   paintFirst: 'fill',
  //                   rx: 0,
  //                   ry: 0,
  //                   scaleX: 2,
  //                   scaleY: 2,
  //                   selectable: true,
  //                   shadow: null,
  //                   skewX: 0,
  //                   skewY: 0,
  //                   stroke: null,
  //                   strokeDashArray: null,
  //                   strokeDashOffset: 0,
  //                   strokeLineCap: 'butt',
  //                   strokeLineJoin: 'miter',
  //                   strokeMiterLimit: 4,
  //                   strokeUniform: false,
  //                   strokeWidth: 1,
  //                   top: 81.43299999999999,
  //                   type: 'rect',
  //                   version: '5.2.1',
  //                   visible: true,
  //                   width: 682,
  //                 },
  //                 cornerColor: 'rgb(178,204,255)',
  //                 cropX: 0,
  //                 cropY: 0,
  //                 crossOrigin: 'anonymous',
  //                 data: {
  //                   photoZoneId: 'photozone-0',
  //                   type: 'photo-zone-image',
  //                 },
  //                 evented: true,
  //                 fill: 'rgb(0,0,0)',
  //                 fillRule: 'nonzero',
  //                 filters: [],
  //                 flipX: false,
  //                 flipY: false,
  //                 globalCompositeOperation: 'source-over',
  //                 hasControls: true,
  //                 height: 6000,
  //                 hoverCursor: null,
  //                 left: 57.433,
  //                 lockMovementX: false,
  //                 lockMovementY: false,
  //                 lockRotation: false,
  //                 lockScalingFlip: false,
  //                 lockSkewingX: false,
  //                 minScaleLimit: 0,
  //                 name: '09464558-07f5-4025-b8a7-2cc5e56b72d0',
  //                 oCoords: {
  //                   bl: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 165.83212408009103,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 165.83212408009103,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: 152.8321240798437,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: 152.8321240798437,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 171.33212408019565,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 171.33212408019565,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: 147.3321240797391,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: 147.3321240797391,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 159.33212407996737,
  //                   },
  //                   br: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.37306853086844,
  //                         y: 165.83212408009103,
  //                       },
  //                       br: {
  //                         x: 113.37306853111576,
  //                         y: 165.83212408009103,
  //                       },
  //                       tl: {
  //                         x: 100.37306853086844,
  //                         y: 152.8321240798437,
  //                       },
  //                       tr: {
  //                         x: 113.37306853111576,
  //                         y: 152.8321240798437,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 94.8730685307638,
  //                         y: 171.33212408019565,
  //                       },
  //                       br: {
  //                         x: 118.8730685312204,
  //                         y: 171.33212408019565,
  //                       },
  //                       tl: {
  //                         x: 94.8730685307638,
  //                         y: 147.3321240797391,
  //                       },
  //                       tr: {
  //                         x: 118.8730685312204,
  //                         y: 147.3321240797391,
  //                       },
  //                     },
  //                     x: 106.8730685309921,
  //                     y: 159.33212407996737,
  //                   },
  //                   mb: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.78718821171169,
  //                         y: 165.83212408009103,
  //                       },
  //                       br: {
  //                         x: 60.787188211959005,
  //                         y: 165.83212408009103,
  //                       },
  //                       tl: {
  //                         x: 47.787188211711694,
  //                         y: 152.8321240798437,
  //                       },
  //                       tr: {
  //                         x: 60.78718821195901,
  //                         y: 152.8321240798437,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.28718821160705,
  //                         y: 171.33212408019565,
  //                       },
  //                       br: {
  //                         x: 66.28718821206364,
  //                         y: 171.33212408019565,
  //                       },
  //                       tl: {
  //                         x: 42.28718821160706,
  //                         y: 147.3321240797391,
  //                       },
  //                       tr: {
  //                         x: 66.28718821206364,
  //                         y: 147.3321240797391,
  //                       },
  //                     },
  //                     x: 54.28718821183535,
  //                     y: 159.33212407996737,
  //                   },
  //                   ml: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 86.9533036013559,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 86.9533036013559,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: 73.95330360110857,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: 73.95330360110857,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 92.45330360146053,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 92.45330360146053,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: 68.45330360100394,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: 68.45330360100394,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 80.45330360123224,
  //                   },
  //                   mr: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.37306853086844,
  //                         y: 86.9533036013559,
  //                       },
  //                       br: {
  //                         x: 113.37306853111576,
  //                         y: 86.9533036013559,
  //                       },
  //                       tl: {
  //                         x: 100.37306853086844,
  //                         y: 73.95330360110857,
  //                       },
  //                       tr: {
  //                         x: 113.37306853111576,
  //                         y: 73.95330360110857,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 94.8730685307638,
  //                         y: 92.45330360146053,
  //                       },
  //                       br: {
  //                         x: 118.8730685312204,
  //                         y: 92.45330360146053,
  //                       },
  //                       tl: {
  //                         x: 94.8730685307638,
  //                         y: 68.45330360100394,
  //                       },
  //                       tr: {
  //                         x: 118.8730685312204,
  //                         y: 68.45330360100394,
  //                       },
  //                     },
  //                     x: 106.8730685309921,
  //                     y: 80.45330360123224,
  //                   },
  //                   mt: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.78718821171169,
  //                         y: 8.074483122620759,
  //                       },
  //                       br: {
  //                         x: 60.787188211959005,
  //                         y: 8.07448312262076,
  //                       },
  //                       tl: {
  //                         x: 47.787188211711694,
  //                         y: -4.925516877626562,
  //                       },
  //                       tr: {
  //                         x: 60.78718821195901,
  //                         y: -4.92551687762656,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.28718821160705,
  //                         y: 13.574483122725393,
  //                       },
  //                       br: {
  //                         x: 66.28718821206364,
  //                         y: 13.574483122725395,
  //                       },
  //                       tl: {
  //                         x: 42.28718821160706,
  //                         y: -10.425516877731196,
  //                       },
  //                       tr: {
  //                         x: 66.28718821206364,
  //                         y: -10.425516877731194,
  //                       },
  //                     },
  //                     x: 54.28718821183535,
  //                     y: 1.5744831224970994,
  //                   },
  //                   mtr: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.78718821171169,
  //                         y: -31.92551687737924,
  //                       },
  //                       br: {
  //                         x: 60.787188211959005,
  //                         y: -31.925516877379238,
  //                       },
  //                       tl: {
  //                         x: 47.787188211711694,
  //                         y: -44.92551687762656,
  //                       },
  //                       tr: {
  //                         x: 60.78718821195901,
  //                         y: -44.92551687762656,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.28718821160705,
  //                         y: -26.425516877274607,
  //                       },
  //                       br: {
  //                         x: 66.28718821206364,
  //                         y: -26.425516877274603,
  //                       },
  //                       tl: {
  //                         x: 42.28718821160706,
  //                         y: -50.4255168777312,
  //                       },
  //                       tr: {
  //                         x: 66.28718821206364,
  //                         y: -50.4255168777312,
  //                       },
  //                     },
  //                     x: 54.28718821183535,
  //                     y: -38.4255168775029,
  //                   },
  //                   tl: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 8.074483122620759,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 8.07448312262076,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: -4.925516877626562,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: -4.92551687762656,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 13.574483122725393,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 13.574483122725395,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: -10.425516877731196,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: -10.425516877731194,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 1.5744831224970994,
  //                   },
  //                   tr: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.37306853086844,
  //                         y: 8.074483122620759,
  //                       },
  //                       br: {
  //                         x: 113.37306853111576,
  //                         y: 8.07448312262076,
  //                       },
  //                       tl: {
  //                         x: 100.37306853086844,
  //                         y: -4.925516877626562,
  //                       },
  //                       tr: {
  //                         x: 113.37306853111576,
  //                         y: -4.92551687762656,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 94.8730685307638,
  //                         y: 13.574483122725393,
  //                       },
  //                       br: {
  //                         x: 118.8730685312204,
  //                         y: 13.574483122725395,
  //                       },
  //                       tl: {
  //                         x: 94.8730685307638,
  //                         y: -10.425516877731196,
  //                       },
  //                       tr: {
  //                         x: 118.8730685312204,
  //                         y: -10.425516877731194,
  //                       },
  //                     },
  //                     x: 106.8730685309921,
  //                     y: 1.5744831224970994,
  //                   },
  //                 },
  //                 objectCaching: true,
  //                 opacity: 1,
  //                 originX: 'left',
  //                 originY: 'top',
  //                 padding: 0,
  //                 paintFirst: 'fill',
  //                 scaleX: 0.34,
  //                 scaleY: 0.34,
  //                 selectable: true,
  //                 shadow: null,
  //                 skewX: 0,
  //                 skewY: 0,
  //                 src: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/145128da-ed24-477b-8044-c6d794972bb74961356203726284973.jpg?1680087681900',
  //                 stroke: null,
  //                 strokeDashArray: null,
  //                 strokeDashOffset: 0,
  //                 strokeLineCap: 'butt',
  //                 strokeLineJoin: 'miter',
  //                 strokeMiterLimit: 4,
  //                 strokeUniform: false,
  //                 strokeWidth: 0,
  //                 top: 55.793,
  //                 type: 'image',
  //                 version: '5.2.1',
  //                 visible: true,
  //                 width: 4000,
  //               },
  //               {
  //                 angle: 0,
  //                 backgroundColor: 'transparent',
  //                 borderDashArray: null,
  //                 charSpacing: 0,
  //                 cornerColor: 'rgb(178,204,255)',
  //                 data: {
  //                   fixedWidth: 1,
  //                   isEdited: false,
  //                   maxFontSize: 52,
  //                 },
  //                 direction: 'ltr',
  //                 editable: true,
  //                 editableText: true,
  //                 editingBorderColor: 'rgba(102,153,255,0.25)',
  //                 evented: true,
  //                 fill: '#f2ecce',
  //                 fillRule: 'nonzero',
  //                 flipX: false,
  //                 flipY: false,
  //                 fontFamily: 'fontid-119',
  //                 fontSize: 202,
  //                 fontStyle: 'normal',
  //                 fontWeight: 'normal',
  //                 globalCompositeOperation: 'source-over',
  //                 hasControls: false,
  //                 hasRotatingPoint: false,
  //                 height: 228.26,
  //                 hoverCursor: 'pointer',
  //                 isModified: true,
  //                 left: 205.993,
  //                 lineHeight: 1.16,
  //                 linethrough: false,
  //                 lockMovementX: true,
  //                 lockMovementY: true,
  //                 lockRotation: true,
  //                 lockScalingFlip: true,
  //                 lockSkewingX: false,
  //                 minScaleLimit: 0,
  //                 minWidth: 20,
  //                 name: 'userTextbox-1-0',
  //                 oCoords: {
  //                   bl: {
  //                     corner: {
  //                       bl: {
  //                         x: 1.6897760987518868,
  //                         y: 158.50460175409577,
  //                       },
  //                       br: {
  //                         x: 14.689776098999207,
  //                         y: 158.50460175409577,
  //                       },
  //                       tl: {
  //                         x: 1.6897760987518886,
  //                         y: 145.50460175384845,
  //                       },
  //                       tr: {
  //                         x: 14.689776098999209,
  //                         y: 145.50460175384845,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -3.8102239013527477,
  //                         y: 164.0046017542004,
  //                       },
  //                       br: {
  //                         x: 20.18977609910384,
  //                         y: 164.0046017542004,
  //                       },
  //                       tl: {
  //                         x: -3.810223901352746,
  //                         y: 140.00460175374383,
  //                       },
  //                       tr: {
  //                         x: 20.189776099103845,
  //                         y: 140.00460175374383,
  //                       },
  //                     },
  //                     x: 8.189776098875548,
  //                     y: 152.0046017539721,
  //                   },
  //                   br: {
  //                     corner: {
  //                       bl: {
  //                         x: 94.1258767167241,
  //                         y: 158.50460175409577,
  //                       },
  //                       br: {
  //                         x: 107.12587671697142,
  //                         y: 158.50460175409577,
  //                       },
  //                       tl: {
  //                         x: 94.1258767167241,
  //                         y: 145.50460175384845,
  //                       },
  //                       tr: {
  //                         x: 107.12587671697142,
  //                         y: 145.50460175384845,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 88.62587671661946,
  //                         y: 164.0046017542004,
  //                       },
  //                       br: {
  //                         x: 112.62587671707605,
  //                         y: 164.0046017542004,
  //                       },
  //                       tl: {
  //                         x: 88.62587671661946,
  //                         y: 140.00460175374383,
  //                       },
  //                       tr: {
  //                         x: 112.62587671707605,
  //                         y: 140.00460175374383,
  //                       },
  //                     },
  //                     x: 100.62587671684776,
  //                     y: 152.0046017539721,
  //                   },
  //                   mb: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.907826407737986,
  //                         y: 158.50460175409577,
  //                       },
  //                       br: {
  //                         x: 60.90782640798531,
  //                         y: 158.50460175409577,
  //                       },
  //                       tl: {
  //                         x: 47.907826407737986,
  //                         y: 145.50460175384845,
  //                       },
  //                       tr: {
  //                         x: 60.90782640798531,
  //                         y: 145.50460175384845,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.40782640763335,
  //                         y: 164.0046017542004,
  //                       },
  //                       br: {
  //                         x: 66.40782640808995,
  //                         y: 164.0046017542004,
  //                       },
  //                       tl: {
  //                         x: 42.40782640763335,
  //                         y: 140.00460175374383,
  //                       },
  //                       tr: {
  //                         x: 66.40782640808995,
  //                         y: 140.00460175374383,
  //                       },
  //                     },
  //                     x: 54.40782640786165,
  //                     y: 152.0046017539721,
  //                   },
  //                   ml: {
  //                     corner: {
  //                       bl: {
  //                         x: 1.6897760987518868,
  //                         y: 144.60134822300088,
  //                       },
  //                       br: {
  //                         x: 14.689776098999207,
  //                         y: 144.60134822300088,
  //                       },
  //                       tl: {
  //                         x: 1.6897760987518886,
  //                         y: 131.60134822275356,
  //                       },
  //                       tr: {
  //                         x: 14.689776098999209,
  //                         y: 131.60134822275356,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -3.8102239013527477,
  //                         y: 150.1013482231055,
  //                       },
  //                       br: {
  //                         x: 20.18977609910384,
  //                         y: 150.1013482231055,
  //                       },
  //                       tl: {
  //                         x: -3.810223901352746,
  //                         y: 126.10134822264892,
  //                       },
  //                       tr: {
  //                         x: 20.189776099103845,
  //                         y: 126.10134822264892,
  //                       },
  //                     },
  //                     x: 8.189776098875548,
  //                     y: 138.10134822287722,
  //                   },
  //                   mr: {
  //                     corner: {
  //                       bl: {
  //                         x: 94.1258767167241,
  //                         y: 144.60134822300088,
  //                       },
  //                       br: {
  //                         x: 107.12587671697142,
  //                         y: 144.60134822300088,
  //                       },
  //                       tl: {
  //                         x: 94.1258767167241,
  //                         y: 131.60134822275356,
  //                       },
  //                       tr: {
  //                         x: 107.12587671697142,
  //                         y: 131.60134822275356,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 88.62587671661946,
  //                         y: 150.1013482231055,
  //                       },
  //                       br: {
  //                         x: 112.62587671707605,
  //                         y: 150.1013482231055,
  //                       },
  //                       tl: {
  //                         x: 88.62587671661946,
  //                         y: 126.10134822264892,
  //                       },
  //                       tr: {
  //                         x: 112.62587671707605,
  //                         y: 126.10134822264892,
  //                       },
  //                     },
  //                     x: 100.62587671684776,
  //                     y: 138.10134822287722,
  //                   },
  //                   mt: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.907826407737986,
  //                         y: 130.698094691906,
  //                       },
  //                       br: {
  //                         x: 60.90782640798531,
  //                         y: 130.698094691906,
  //                       },
  //                       tl: {
  //                         x: 47.907826407737986,
  //                         y: 117.69809469165868,
  //                       },
  //                       tr: {
  //                         x: 60.90782640798531,
  //                         y: 117.69809469165868,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.40782640763335,
  //                         y: 136.19809469201064,
  //                       },
  //                       br: {
  //                         x: 66.40782640808995,
  //                         y: 136.19809469201064,
  //                       },
  //                       tl: {
  //                         x: 42.40782640763335,
  //                         y: 112.19809469155405,
  //                       },
  //                       tr: {
  //                         x: 66.40782640808995,
  //                         y: 112.19809469155405,
  //                       },
  //                     },
  //                     x: 54.40782640786165,
  //                     y: 124.19809469178234,
  //                   },
  //                   mtr: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.907826407737986,
  //                         y: 90.69809469190601,
  //                       },
  //                       br: {
  //                         x: 60.90782640798531,
  //                         y: 90.69809469190601,
  //                       },
  //                       tl: {
  //                         x: 47.907826407737986,
  //                         y: 77.69809469165868,
  //                       },
  //                       tr: {
  //                         x: 60.90782640798531,
  //                         y: 77.69809469165868,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.40782640763335,
  //                         y: 96.19809469201064,
  //                       },
  //                       br: {
  //                         x: 66.40782640808995,
  //                         y: 96.19809469201064,
  //                       },
  //                       tl: {
  //                         x: 42.40782640763335,
  //                         y: 72.19809469155405,
  //                       },
  //                       tr: {
  //                         x: 66.40782640808995,
  //                         y: 72.19809469155405,
  //                       },
  //                     },
  //                     x: 54.40782640786165,
  //                     y: 84.19809469178234,
  //                   },
  //                   tl: {
  //                     corner: {
  //                       bl: {
  //                         x: 1.6897760987518868,
  //                         y: 130.698094691906,
  //                       },
  //                       br: {
  //                         x: 14.689776098999207,
  //                         y: 130.698094691906,
  //                       },
  //                       tl: {
  //                         x: 1.6897760987518886,
  //                         y: 117.69809469165868,
  //                       },
  //                       tr: {
  //                         x: 14.689776098999209,
  //                         y: 117.69809469165868,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -3.8102239013527477,
  //                         y: 136.19809469201064,
  //                       },
  //                       br: {
  //                         x: 20.18977609910384,
  //                         y: 136.19809469201064,
  //                       },
  //                       tl: {
  //                         x: -3.810223901352746,
  //                         y: 112.19809469155405,
  //                       },
  //                       tr: {
  //                         x: 20.189776099103845,
  //                         y: 112.19809469155405,
  //                       },
  //                     },
  //                     x: 8.189776098875548,
  //                     y: 124.19809469178234,
  //                   },
  //                   tr: {
  //                     corner: {
  //                       bl: {
  //                         x: 94.1258767167241,
  //                         y: 130.698094691906,
  //                       },
  //                       br: {
  //                         x: 107.12587671697142,
  //                         y: 130.698094691906,
  //                       },
  //                       tl: {
  //                         x: 94.1258767167241,
  //                         y: 117.69809469165868,
  //                       },
  //                       tr: {
  //                         x: 107.12587671697142,
  //                         y: 117.69809469165868,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 88.62587671661946,
  //                         y: 136.19809469201064,
  //                       },
  //                       br: {
  //                         x: 112.62587671707605,
  //                         y: 136.19809469201064,
  //                       },
  //                       tl: {
  //                         x: 88.62587671661946,
  //                         y: 112.19809469155405,
  //                       },
  //                       tr: {
  //                         x: 112.62587671707605,
  //                         y: 112.19809469155405,
  //                       },
  //                     },
  //                     x: 100.62587671684776,
  //                     y: 124.19809469178234,
  //                   },
  //                 },
  //                 objectCaching: true,
  //                 opacity: 1,
  //                 originX: 'left',
  //                 originY: 'center',
  //                 overline: false,
  //                 padding: 5,
  //                 paintFirst: 'fill',
  //                 path: null,
  //                 pathAlign: 'baseline',
  //                 pathSide: 'left',
  //                 pathStartOffset: 0,
  //                 scaleX: 1,
  //                 scaleY: 1,
  //                 selectable: true,
  //                 selectionColor: 'rgba(237, 141, 56, 0.2)',
  //                 selectionEnd: 4,
  //                 selectionStart: 4,
  //                 shadow: null,
  //                 skewX: 0,
  //                 skewY: 0,
  //                 splitByGrapheme: false,
  //                 stroke: null,
  //                 strokeDashArray: null,
  //                 strokeDashOffset: 0,
  //                 strokeLineCap: 'butt',
  //                 strokeLineJoin: 'miter',
  //                 strokeMiterLimit: 4,
  //                 strokeUniform: false,
  //                 strokeWidth: 1,
  //                 styles: {},
  //                 text: 'SHRIKANT',
  //                 textAlign: 'center',
  //                 textBackgroundColor: '',
  //                 top: 1821.253,
  //                 type: 'textbox',
  //                 underline: false,
  //                 version: '5.2.1',
  //                 visible: true,
  //                 width: 1064,
  //               },
  //               {
  //                 angle: 0,
  //                 backgroundColor: '',
  //                 borderDashArray: null,
  //                 cornerColor: 'rgb(178,204,255)',
  //                 data: {
  //                   hasContent: true,
  //                 },
  //                 evented: true,
  //                 fill: '#838684',
  //                 fillRule: 'nonzero',
  //                 flipX: false,
  //                 flipY: false,
  //                 globalCompositeOperation: 'source-over',
  //                 hasControls: true,
  //                 hasImg: false,
  //                 hasRotatingPoint: false,
  //                 height: 976,
  //                 hoverCursor: 'pointer',
  //                 left: 57.433,
  //                 lockMovementX: true,
  //                 lockMovementY: true,
  //                 lockRotation: false,
  //                 lockScalingFlip: false,
  //                 lockSkewingX: false,
  //                 minScaleLimit: 0,
  //                 name: 'photozone-0',
  //                 oCoords: {
  //                   bl: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 161.0096895261166,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 161.0096895261166,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: 148.00968952586928,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: 148.00968952586928,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 166.50968952622122,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 166.50968952622122,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: 142.50968952576466,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: 142.50968952576466,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 154.50968952599294,
  //                   },
  //                   br: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.68239723862818,
  //                         y: 161.0096895261166,
  //                       },
  //                       br: {
  //                         x: 113.68239723887551,
  //                         y: 161.0096895261166,
  //                       },
  //                       tl: {
  //                         x: 100.68239723862818,
  //                         y: 148.00968952586928,
  //                       },
  //                       tr: {
  //                         x: 113.68239723887551,
  //                         y: 148.00968952586928,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 95.18239723852355,
  //                         y: 166.50968952622122,
  //                       },
  //                       br: {
  //                         x: 119.18239723898014,
  //                         y: 166.50968952622122,
  //                       },
  //                       tl: {
  //                         x: 95.18239723852355,
  //                         y: 142.50968952576466,
  //                       },
  //                       tr: {
  //                         x: 119.18239723898014,
  //                         y: 142.50968952576466,
  //                       },
  //                     },
  //                     x: 107.18239723875185,
  //                     y: 154.50968952599294,
  //                   },
  //                   mb: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: 161.0096895261166,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: 161.0096895261166,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: 148.00968952586928,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: 148.00968952586928,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: 166.50968952622122,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: 166.50968952622122,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: 142.50968952576466,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: 142.50968952576466,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: 154.50968952599294,
  //                   },
  //                   ml: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 85.53348483273867,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 85.53348483273867,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: 72.53348483249134,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: 72.53348483249134,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 91.0334848328433,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 91.0334848328433,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: 67.0334848323867,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: 67.0334848323867,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 79.033484832615,
  //                   },
  //                   mr: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.68239723862818,
  //                         y: 85.53348483273867,
  //                       },
  //                       br: {
  //                         x: 113.68239723887551,
  //                         y: 85.53348483273867,
  //                       },
  //                       tl: {
  //                         x: 100.68239723862818,
  //                         y: 72.53348483249134,
  //                       },
  //                       tr: {
  //                         x: 113.68239723887551,
  //                         y: 72.53348483249134,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 95.18239723852355,
  //                         y: 91.0334848328433,
  //                       },
  //                       br: {
  //                         x: 119.18239723898014,
  //                         y: 91.0334848328433,
  //                       },
  //                       tl: {
  //                         x: 95.18239723852355,
  //                         y: 67.0334848323867,
  //                       },
  //                       tr: {
  //                         x: 119.18239723898014,
  //                         y: 67.0334848323867,
  //                       },
  //                     },
  //                     x: 107.18239723875185,
  //                     y: 79.033484832615,
  //                   },
  //                   mt: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: 10.057280139360739,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: 10.05728013936074,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: -2.942719860886582,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: -2.94271986088658,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: 15.557280139465373,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: 15.557280139465375,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: -8.442719860991216,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: -8.442719860991215,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: 3.557280139237079,
  //                   },
  //                   mtr: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: -29.94271986063926,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: -29.942719860639258,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: -42.942719860886584,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: -42.942719860886584,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: -24.442719860534627,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: -24.442719860534623,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: -48.44271986099122,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: -48.44271986099122,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: -36.44271986076292,
  //                   },
  //                   tl: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 10.057280139360739,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 10.05728013936074,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: -2.942719860886582,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: -2.94271986088658,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 15.557280139465373,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 15.557280139465375,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: -8.442719860991216,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: -8.442719860991215,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 3.557280139237079,
  //                   },
  //                   tr: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.68239723862818,
  //                         y: 10.057280139360739,
  //                       },
  //                       br: {
  //                         x: 113.68239723887551,
  //                         y: 10.05728013936074,
  //                       },
  //                       tl: {
  //                         x: 100.68239723862818,
  //                         y: -2.942719860886582,
  //                       },
  //                       tr: {
  //                         x: 113.68239723887551,
  //                         y: -2.94271986088658,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 95.18239723852355,
  //                         y: 15.557280139465373,
  //                       },
  //                       br: {
  //                         x: 119.18239723898014,
  //                         y: 15.557280139465375,
  //                       },
  //                       tl: {
  //                         x: 95.18239723852355,
  //                         y: -8.442719860991216,
  //                       },
  //                       tr: {
  //                         x: 119.18239723898014,
  //                         y: -8.442719860991215,
  //                       },
  //                     },
  //                     x: 107.18239723875185,
  //                     y: 3.557280139237079,
  //                   },
  //                 },
  //                 objectCaching: true,
  //                 opacity: 1,
  //                 originX: 'left',
  //                 originY: 'top',
  //                 padding: 0,
  //                 paintFirst: 'fill',
  //                 rx: 0,
  //                 ry: 0,
  //                 scaleX: 2,
  //                 scaleY: 2,
  //                 selectable: false,
  //                 shadow: null,
  //                 skewX: 0,
  //                 skewY: 0,
  //                 stroke: null,
  //                 strokeDashArray: null,
  //                 strokeDashOffset: 0,
  //                 strokeLineCap: 'butt',
  //                 strokeLineJoin: 'miter',
  //                 strokeMiterLimit: 4,
  //                 strokeUniform: false,
  //                 strokeWidth: 0,
  //                 top: 81.43299999999999,
  //                 type: 'rect',
  //                 version: '5.2.1',
  //                 visible: false,
  //                 width: 682,
  //                 zoneId: 'p0',
  //               },
  //               {
  //                 angle: 0,
  //                 backgroundColor: '',
  //                 borderDashArray: null,
  //                 cornerColor: 'rgb(178,204,255)',
  //                 data: {
  //                   photoZoneId: 'photozone-0',
  //                   type: 'photo-zone-button',
  //                 },
  //                 evented: true,
  //                 fill: 'rgb(0,0,0)',
  //                 fillRule: 'nonzero',
  //                 flipX: false,
  //                 flipY: false,
  //                 globalCompositeOperation: 'source-over',
  //                 hasControls: true,
  //                 height: 976,
  //                 hoverCursor: 'pointer',
  //                 left: 57.433,
  //                 lockMovementX: false,
  //                 lockMovementY: false,
  //                 lockRotation: false,
  //                 lockScalingFlip: false,
  //                 lockSkewingX: false,
  //                 minScaleLimit: 0,
  //                 name: 'photozone-0-button',
  //                 oCoords: {
  //                   bl: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 161.0096895261166,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 161.0096895261166,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: 148.00968952586928,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: 148.00968952586928,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 166.50968952622122,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 166.50968952622122,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: 142.50968952576466,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: 142.50968952576466,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 154.50968952599294,
  //                   },
  //                   br: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.68239723862818,
  //                         y: 161.0096895261166,
  //                       },
  //                       br: {
  //                         x: 113.68239723887551,
  //                         y: 161.0096895261166,
  //                       },
  //                       tl: {
  //                         x: 100.68239723862818,
  //                         y: 148.00968952586928,
  //                       },
  //                       tr: {
  //                         x: 113.68239723887551,
  //                         y: 148.00968952586928,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 95.18239723852355,
  //                         y: 166.50968952622122,
  //                       },
  //                       br: {
  //                         x: 119.18239723898014,
  //                         y: 166.50968952622122,
  //                       },
  //                       tl: {
  //                         x: 95.18239723852355,
  //                         y: 142.50968952576466,
  //                       },
  //                       tr: {
  //                         x: 119.18239723898014,
  //                         y: 142.50968952576466,
  //                       },
  //                     },
  //                     x: 107.18239723875185,
  //                     y: 154.50968952599294,
  //                   },
  //                   mb: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: 161.0096895261166,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: 161.0096895261166,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: 148.00968952586928,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: 148.00968952586928,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: 166.50968952622122,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: 166.50968952622122,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: 142.50968952576466,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: 142.50968952576466,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: 154.50968952599294,
  //                   },
  //                   ml: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 85.53348483273867,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 85.53348483273867,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: 72.53348483249134,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: 72.53348483249134,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 91.0334848328433,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 91.0334848328433,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: 67.0334848323867,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: 67.0334848323867,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 79.033484832615,
  //                   },
  //                   mr: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.68239723862818,
  //                         y: 85.53348483273867,
  //                       },
  //                       br: {
  //                         x: 113.68239723887551,
  //                         y: 85.53348483273867,
  //                       },
  //                       tl: {
  //                         x: 100.68239723862818,
  //                         y: 72.53348483249134,
  //                       },
  //                       tr: {
  //                         x: 113.68239723887551,
  //                         y: 72.53348483249134,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 95.18239723852355,
  //                         y: 91.0334848328433,
  //                       },
  //                       br: {
  //                         x: 119.18239723898014,
  //                         y: 91.0334848328433,
  //                       },
  //                       tl: {
  //                         x: 95.18239723852355,
  //                         y: 67.0334848323867,
  //                       },
  //                       tr: {
  //                         x: 119.18239723898014,
  //                         y: 67.0334848323867,
  //                       },
  //                     },
  //                     x: 107.18239723875185,
  //                     y: 79.033484832615,
  //                   },
  //                   mt: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: 10.057280139360739,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: 10.05728013936074,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: -2.942719860886582,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: -2.94271986088658,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: 15.557280139465373,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: 15.557280139465375,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: -8.442719860991216,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: -8.442719860991215,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: 3.557280139237079,
  //                   },
  //                   mtr: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: -29.94271986063926,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: -29.942719860639258,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: -42.942719860886584,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: -42.942719860886584,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: -24.442719860534627,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: -24.442719860534623,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: -48.44271986099122,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: -48.44271986099122,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: -36.44271986076292,
  //                   },
  //                   tl: {
  //                     corner: {
  //                       bl: {
  //                         x: -4.798692107445062,
  //                         y: 10.057280139360739,
  //                       },
  //                       br: {
  //                         x: 8.201307892802259,
  //                         y: 10.05728013936074,
  //                       },
  //                       tl: {
  //                         x: -4.79869210744506,
  //                         y: -2.942719860886582,
  //                       },
  //                       tr: {
  //                         x: 8.20130789280226,
  //                         y: -2.94271986088658,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.298692107549696,
  //                         y: 15.557280139465373,
  //                       },
  //                       br: {
  //                         x: 13.701307892906893,
  //                         y: 15.557280139465375,
  //                       },
  //                       tl: {
  //                         x: -10.298692107549694,
  //                         y: -8.442719860991216,
  //                       },
  //                       tr: {
  //                         x: 13.701307892906895,
  //                         y: -8.442719860991215,
  //                       },
  //                     },
  //                     x: 1.7013078926785994,
  //                     y: 3.557280139237079,
  //                   },
  //                   tr: {
  //                     corner: {
  //                       bl: {
  //                         x: 100.68239723862818,
  //                         y: 10.057280139360739,
  //                       },
  //                       br: {
  //                         x: 113.68239723887551,
  //                         y: 10.05728013936074,
  //                       },
  //                       tl: {
  //                         x: 100.68239723862818,
  //                         y: -2.942719860886582,
  //                       },
  //                       tr: {
  //                         x: 113.68239723887551,
  //                         y: -2.94271986088658,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 95.18239723852355,
  //                         y: 15.557280139465373,
  //                       },
  //                       br: {
  //                         x: 119.18239723898014,
  //                         y: 15.557280139465375,
  //                       },
  //                       tl: {
  //                         x: 95.18239723852355,
  //                         y: -8.442719860991216,
  //                       },
  //                       tr: {
  //                         x: 119.18239723898014,
  //                         y: -8.442719860991215,
  //                       },
  //                     },
  //                     x: 107.18239723875185,
  //                     y: 3.557280139237079,
  //                   },
  //                 },
  //                 objectCaching: true,
  //                 objects: [
  //                   {
  //                     angle: 0,
  //                     backgroundColor: '',
  //                     borderDashArray: null,
  //                     cornerColor: 'rgb(178,204,255)',
  //                     cropX: 0,
  //                     cropY: 0,
  //                     crossOrigin: null,
  //                     evented: true,
  //                     fill: 'rgb(0,0,0)',
  //                     fillRule: 'nonzero',
  //                     filters: [],
  //                     flipX: false,
  //                     flipY: false,
  //                     globalCompositeOperation: 'source-over',
  //                     hasControls: true,
  //                     height: 48,
  //                     hoverCursor: null,
  //                     left: 0,
  //                     lockMovementX: false,
  //                     lockMovementY: false,
  //                     lockRotation: false,
  //                     lockScalingFlip: false,
  //                     lockSkewingX: false,
  //                     minScaleLimit: 0,
  //                     oCoords: {
  //                       bl: {
  //                         corner: {
  //                           bl: {
  //                             x: -6.500000000123661,
  //                             y: 270.1301935485107,
  //                           },
  //                           br: {
  //                             x: 6.500000000123659,
  //                             y: 270.1301935485107,
  //                           },
  //                           tl: {
  //                             x: -6.500000000123659,
  //                             y: 257.13019354826343,
  //                           },
  //                           tr: {
  //                             x: 6.500000000123661,
  //                             y: 257.13019354826343,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: -12.000000000228296,
  //                             y: 275.63019354861535,
  //                           },
  //                           br: {
  //                             x: 12.000000000228294,
  //                             y: 275.63019354861535,
  //                           },
  //                           tl: {
  //                             x: -12.000000000228294,
  //                             y: 251.6301935481588,
  //                           },
  //                           tr: {
  //                             x: 12.000000000228296,
  //                             y: 251.6301935481588,
  //                           },
  //                         },
  //                         x: 0,
  //                         y: 263.63019354838707,
  //                       },
  //                       br: {
  //                         corner: {
  //                           bl: {
  //                             x: 257.13019354826343,
  //                             y: 270.1301935485107,
  //                           },
  //                           br: {
  //                             x: 270.1301935485107,
  //                             y: 270.1301935485107,
  //                           },
  //                           tl: {
  //                             x: 257.13019354826343,
  //                             y: 257.13019354826343,
  //                           },
  //                           tr: {
  //                             x: 270.1301935485107,
  //                             y: 257.13019354826343,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: 251.6301935481588,
  //                             y: 275.63019354861535,
  //                           },
  //                           br: {
  //                             x: 275.63019354861535,
  //                             y: 275.63019354861535,
  //                           },
  //                           tl: {
  //                             x: 251.6301935481588,
  //                             y: 251.6301935481588,
  //                           },
  //                           tr: {
  //                             x: 275.63019354861535,
  //                             y: 251.6301935481588,
  //                           },
  //                         },
  //                         x: 263.63019354838707,
  //                         y: 263.63019354838707,
  //                       },
  //                       mb: {
  //                         corner: {
  //                           bl: {
  //                             x: 125.31509677406987,
  //                             y: 270.1301935485107,
  //                           },
  //                           br: {
  //                             x: 138.3150967743172,
  //                             y: 270.1301935485107,
  //                           },
  //                           tl: {
  //                             x: 125.31509677406987,
  //                             y: 257.13019354826343,
  //                           },
  //                           tr: {
  //                             x: 138.3150967743172,
  //                             y: 257.13019354826343,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: 119.81509677396524,
  //                             y: 275.63019354861535,
  //                           },
  //                           br: {
  //                             x: 143.81509677442182,
  //                             y: 275.63019354861535,
  //                           },
  //                           tl: {
  //                             x: 119.81509677396524,
  //                             y: 251.6301935481588,
  //                           },
  //                           tr: {
  //                             x: 143.81509677442182,
  //                             y: 251.6301935481588,
  //                           },
  //                         },
  //                         x: 131.81509677419353,
  //                         y: 263.63019354838707,
  //                       },
  //                       ml: {
  //                         corner: {
  //                           bl: {
  //                             x: -6.500000000123661,
  //                             y: 138.3150967743172,
  //                           },
  //                           br: {
  //                             x: 6.500000000123659,
  //                             y: 138.3150967743172,
  //                           },
  //                           tl: {
  //                             x: -6.500000000123659,
  //                             y: 125.31509677406987,
  //                           },
  //                           tr: {
  //                             x: 6.500000000123661,
  //                             y: 125.31509677406987,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: -12.000000000228296,
  //                             y: 143.81509677442182,
  //                           },
  //                           br: {
  //                             x: 12.000000000228294,
  //                             y: 143.81509677442182,
  //                           },
  //                           tl: {
  //                             x: -12.000000000228294,
  //                             y: 119.81509677396524,
  //                           },
  //                           tr: {
  //                             x: 12.000000000228296,
  //                             y: 119.81509677396524,
  //                           },
  //                         },
  //                         x: 0,
  //                         y: 131.81509677419353,
  //                       },
  //                       mr: {
  //                         corner: {
  //                           bl: {
  //                             x: 257.13019354826343,
  //                             y: 138.3150967743172,
  //                           },
  //                           br: {
  //                             x: 270.1301935485107,
  //                             y: 138.3150967743172,
  //                           },
  //                           tl: {
  //                             x: 257.13019354826343,
  //                             y: 125.31509677406987,
  //                           },
  //                           tr: {
  //                             x: 270.1301935485107,
  //                             y: 125.31509677406987,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: 251.6301935481588,
  //                             y: 143.81509677442182,
  //                           },
  //                           br: {
  //                             x: 275.63019354861535,
  //                             y: 143.81509677442182,
  //                           },
  //                           tl: {
  //                             x: 251.6301935481588,
  //                             y: 119.81509677396524,
  //                           },
  //                           tr: {
  //                             x: 275.63019354861535,
  //                             y: 119.81509677396524,
  //                           },
  //                         },
  //                         x: 263.63019354838707,
  //                         y: 131.81509677419353,
  //                       },
  //                       mt: {
  //                         corner: {
  //                           bl: {
  //                             x: 125.31509677406987,
  //                             y: 6.500000000123659,
  //                           },
  //                           br: {
  //                             x: 138.3150967743172,
  //                             y: 6.500000000123661,
  //                           },
  //                           tl: {
  //                             x: 125.31509677406987,
  //                             y: -6.500000000123661,
  //                           },
  //                           tr: {
  //                             x: 138.3150967743172,
  //                             y: -6.500000000123659,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: 119.81509677396524,
  //                             y: 12.000000000228294,
  //                           },
  //                           br: {
  //                             x: 143.81509677442182,
  //                             y: 12.000000000228296,
  //                           },
  //                           tl: {
  //                             x: 119.81509677396524,
  //                             y: -12.000000000228296,
  //                           },
  //                           tr: {
  //                             x: 143.81509677442182,
  //                             y: -12.000000000228294,
  //                           },
  //                         },
  //                         x: 131.81509677419353,
  //                         y: 0,
  //                       },
  //                       mtr: {
  //                         corner: {
  //                           bl: {
  //                             x: 125.31509677406987,
  //                             y: -33.49999999987634,
  //                           },
  //                           br: {
  //                             x: 138.3150967743172,
  //                             y: -33.49999999987634,
  //                           },
  //                           tl: {
  //                             x: 125.31509677406987,
  //                             y: -46.50000000012366,
  //                           },
  //                           tr: {
  //                             x: 138.3150967743172,
  //                             y: -46.50000000012366,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: 119.81509677396524,
  //                             y: -27.999999999771706,
  //                           },
  //                           br: {
  //                             x: 143.81509677442182,
  //                             y: -27.999999999771703,
  //                           },
  //                           tl: {
  //                             x: 119.81509677396524,
  //                             y: -52.0000000002283,
  //                           },
  //                           tr: {
  //                             x: 143.81509677442182,
  //                             y: -52.0000000002283,
  //                           },
  //                         },
  //                         x: 131.81509677419353,
  //                         y: -40,
  //                       },
  //                       tl: {
  //                         corner: {
  //                           bl: {
  //                             x: -6.500000000123661,
  //                             y: 6.500000000123659,
  //                           },
  //                           br: {
  //                             x: 6.500000000123659,
  //                             y: 6.500000000123661,
  //                           },
  //                           tl: {
  //                             x: -6.500000000123659,
  //                             y: -6.500000000123661,
  //                           },
  //                           tr: {
  //                             x: 6.500000000123661,
  //                             y: -6.500000000123659,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: -12.000000000228296,
  //                             y: 12.000000000228294,
  //                           },
  //                           br: {
  //                             x: 12.000000000228294,
  //                             y: 12.000000000228296,
  //                           },
  //                           tl: {
  //                             x: -12.000000000228294,
  //                             y: -12.000000000228296,
  //                           },
  //                           tr: {
  //                             x: 12.000000000228296,
  //                             y: -12.000000000228294,
  //                           },
  //                         },
  //                         x: 0,
  //                         y: 0,
  //                       },
  //                       tr: {
  //                         corner: {
  //                           bl: {
  //                             x: 257.13019354826343,
  //                             y: 6.500000000123659,
  //                           },
  //                           br: {
  //                             x: 270.1301935485107,
  //                             y: 6.500000000123661,
  //                           },
  //                           tl: {
  //                             x: 257.13019354826343,
  //                             y: -6.500000000123661,
  //                           },
  //                           tr: {
  //                             x: 270.1301935485107,
  //                             y: -6.500000000123659,
  //                           },
  //                         },
  //                         touchCorner: {
  //                           bl: {
  //                             x: 251.6301935481588,
  //                             y: 12.000000000228294,
  //                           },
  //                           br: {
  //                             x: 275.63019354861535,
  //                             y: 12.000000000228296,
  //                           },
  //                           tl: {
  //                             x: 251.6301935481588,
  //                             y: -12.000000000228296,
  //                           },
  //                           tr: {
  //                             x: 275.63019354861535,
  //                             y: -12.000000000228294,
  //                           },
  //                         },
  //                         x: 263.63019354838707,
  //                         y: 0,
  //                       },
  //                     },
  //                     objectCaching: true,
  //                     opacity: 1,
  //                     originX: 'top',
  //                     originY: 'center',
  //                     padding: 0,
  //                     paintFirst: 'fill',
  //                     scaleX: 5.49,
  //                     scaleY: 5.49,
  //                     selectable: false,
  //                     shadow: null,
  //                     skewX: 0,
  //                     skewY: 0,
  //                     src: "data:image/svg+xml,%3csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cg clip-path='url(%23clip0_5547_67229)'%3e%3cpath d='M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z' fill='%23604099'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M28.9977 13.7668C30.2608 13.7668 30.9035 14.9576 31.474 16.2197L31.6435 16.5993C31.7084 16.784 31.8571 16.9174 32.0338 16.9569L32.1243 16.9686H33.4397C35.4764 16.9686 35.9608 18.1684 35.9929 19.2244L35.9946 30.4278C36.0416 31.1504 35.7811 31.8572 35.2854 32.3518C34.8349 32.8015 34.2335 33.0323 33.623 32.9963L33.4397 32.9775H14.5601C13.888 33.0763 13.21 32.8465 12.7144 32.3518C12.2638 31.9022 12.0076 31.2772 12 30.6244L12.0052 30.4278V19.3411C12.0052 18.299 12.4075 17.0639 14.2787 16.9738L14.5012 16.9686H20.4985C20.7989 16.9686 20.931 16.7248 21.2342 16.2661L21.6673 15.6278C22.4446 14.4982 22.9783 13.8509 23.826 13.7745L23.9999 13.7668H28.9977ZM26.7487 18.3027C23.5745 18.3027 21.0013 21.0502 21.0013 24.4394C21.0013 27.8287 23.5745 30.5762 26.7487 30.5762C29.9229 30.5762 32.4961 27.8287 32.4961 24.4394C32.4928 21.0517 29.9215 18.3062 26.7487 18.3027ZM26.7487 20.4372C28.8188 20.4372 30.497 22.229 30.497 24.4394C30.497 26.6498 28.8188 28.4416 26.7487 28.4416C24.6785 28.4416 23.0003 26.6498 23.0003 24.4394C23.0003 22.229 24.6785 20.4372 26.7487 20.4372ZM15.7536 19.6367C15.0635 19.6367 14.5042 20.234 14.5042 20.9708C14.5042 21.7076 15.0635 22.3049 15.7536 22.3049C16.4436 22.3049 17.003 21.7076 17.003 20.9708C17.003 20.234 16.4436 19.6367 15.7536 19.6367ZM16.5032 13.5C17.2826 13.5 17.9231 14.1349 17.9957 14.9467L18.0026 15.1009V15.3677C18.0026 15.6297 17.8258 15.8476 17.5927 15.8927L17.5028 15.9013L14.5042 15.8843C14.2588 15.8843 14.0547 15.6955 14.0124 15.4466L14.0044 15.3506V15.1009C14.0044 14.2688 14.599 13.5849 15.3593 13.5073L15.5037 13.5H16.5032Z' fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='clip0_5547_67229'%3e%3crect width='48' height='48' fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
  //                     stroke: null,
  //                     strokeDashArray: null,
  //                     strokeDashOffset: 0,
  //                     strokeLineCap: 'butt',
  //                     strokeLineJoin: 'miter',
  //                     strokeMiterLimit: 4,
  //                     strokeUniform: false,
  //                     strokeWidth: 2,
  //                     top: 0,
  //                     type: 'image',
  //                     version: '5.2.1',
  //                     visible: true,
  //                     width: 48,
  //                   },
  //                 ],
  //                 opacity: 1,
  //                 originX: 'left',
  //                 originY: 'top',
  //                 padding: 0,
  //                 paintFirst: 'fill',
  //                 scaleX: 2,
  //                 scaleY: 2,
  //                 selectable: false,
  //                 shadow: null,
  //                 skewX: 0,
  //                 skewY: 0,
  //                 stroke: null,
  //                 strokeDashArray: null,
  //                 strokeDashOffset: 0,
  //                 strokeLineCap: 'butt',
  //                 strokeLineJoin: 'miter',
  //                 strokeMiterLimit: 4,
  //                 strokeUniform: false,
  //                 strokeWidth: 0,
  //                 top: 81.43299999999999,
  //                 type: 'group',
  //                 version: '5.2.1',
  //                 visible: false,
  //                 width: 682,
  //               },
  //               {
  //                 angle: 0,
  //                 backgroundColor: '',
  //                 borderDashArray: null,
  //                 cornerColor: 'rgb(178,204,255)',
  //                 cropX: 0,
  //                 cropY: 0,
  //                 crossOrigin: 'anonymous',
  //                 evented: false,
  //                 fill: 'rgb(0,0,0)',
  //                 fillRule: 'nonzero',
  //                 filters: [],
  //                 flipX: false,
  //                 flipY: false,
  //                 globalCompositeOperation: 'source-over',
  //                 hasControls: true,
  //                 height: 2114,
  //                 hoverCursor: null,
  //                 left: 1.4329999999999998,
  //                 lockMovementX: false,
  //                 lockMovementY: false,
  //                 lockRotation: false,
  //                 lockScalingFlip: false,
  //                 lockSkewingX: false,
  //                 minScaleLimit: 0,
  //                 name: 'overlayImg',
  //                 oCoords: {
  //                   bl: {
  //                     corner: {
  //                       bl: {
  //                         x: -9.1292940160815,
  //                         y: 167.35092803519137,
  //                       },
  //                       br: {
  //                         x: 3.87070598416582,
  //                         y: 167.35092803519137,
  //                       },
  //                       tl: {
  //                         x: -9.129294016081499,
  //                         y: 154.35092803494405,
  //                       },
  //                       tr: {
  //                         x: 3.870705984165822,
  //                         y: 154.35092803494405,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -14.629294016186135,
  //                         y: 172.850928035296,
  //                       },
  //                       br: {
  //                         x: 9.370705984270455,
  //                         y: 172.850928035296,
  //                       },
  //                       tl: {
  //                         x: -14.629294016186133,
  //                         y: 148.85092803483943,
  //                       },
  //                       tr: {
  //                         x: 9.370705984270456,
  //                         y: 148.85092803483943,
  //                       },
  //                     },
  //                     x: -2.6292940159578393,
  //                     y: 160.8509280350677,
  //                   },
  //                   br: {
  //                     corner: {
  //                       bl: {
  //                         x: 105.01299914726462,
  //                         y: 167.35092803519137,
  //                       },
  //                       br: {
  //                         x: 118.01299914751195,
  //                         y: 167.35092803519137,
  //                       },
  //                       tl: {
  //                         x: 105.01299914726462,
  //                         y: 154.35092803494405,
  //                       },
  //                       tr: {
  //                         x: 118.01299914751195,
  //                         y: 154.35092803494405,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 99.51299914715999,
  //                         y: 172.850928035296,
  //                       },
  //                       br: {
  //                         x: 123.51299914761658,
  //                         y: 172.850928035296,
  //                       },
  //                       tl: {
  //                         x: 99.51299914715999,
  //                         y: 148.85092803483943,
  //                       },
  //                       tr: {
  //                         x: 123.51299914761658,
  //                         y: 148.85092803483943,
  //                       },
  //                     },
  //                     x: 111.51299914738829,
  //                     y: 160.8509280350677,
  //                   },
  //                   mb: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: 167.35092803519137,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: 167.35092803519137,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: 154.35092803494405,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: 154.35092803494405,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: 172.850928035296,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: 172.850928035296,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: 148.85092803483943,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: 148.85092803483943,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: 160.8509280350677,
  //                   },
  //                   ml: {
  //                     corner: {
  //                       bl: {
  //                         x: -9.1292940160815,
  //                         y: 85.6108170096786,
  //                       },
  //                       br: {
  //                         x: 3.87070598416582,
  //                         y: 85.6108170096786,
  //                       },
  //                       tl: {
  //                         x: -9.129294016081499,
  //                         y: 72.61081700943127,
  //                       },
  //                       tr: {
  //                         x: 3.870705984165822,
  //                         y: 72.61081700943127,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -14.629294016186135,
  //                         y: 91.11081700978323,
  //                       },
  //                       br: {
  //                         x: 9.370705984270455,
  //                         y: 91.11081700978323,
  //                       },
  //                       tl: {
  //                         x: -14.629294016186133,
  //                         y: 67.11081700932664,
  //                       },
  //                       tr: {
  //                         x: 9.370705984270456,
  //                         y: 67.11081700932664,
  //                       },
  //                     },
  //                     x: -2.6292940159578393,
  //                     y: 79.11081700955494,
  //                   },
  //                   mr: {
  //                     corner: {
  //                       bl: {
  //                         x: 105.01299914726462,
  //                         y: 85.6108170096786,
  //                       },
  //                       br: {
  //                         x: 118.01299914751195,
  //                         y: 85.6108170096786,
  //                       },
  //                       tl: {
  //                         x: 105.01299914726462,
  //                         y: 72.61081700943127,
  //                       },
  //                       tr: {
  //                         x: 118.01299914751195,
  //                         y: 72.61081700943127,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 99.51299914715999,
  //                         y: 91.11081700978323,
  //                       },
  //                       br: {
  //                         x: 123.51299914761658,
  //                         y: 91.11081700978323,
  //                       },
  //                       tl: {
  //                         x: 99.51299914715999,
  //                         y: 67.11081700932664,
  //                       },
  //                       tr: {
  //                         x: 123.51299914761658,
  //                         y: 67.11081700932664,
  //                       },
  //                     },
  //                     x: 111.51299914738829,
  //                     y: 79.11081700955494,
  //                   },
  //                   mt: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: 3.87070598416582,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: 3.870705984165822,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: -9.1292940160815,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: -9.129294016081499,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: 9.370705984270455,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: 9.370705984270456,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: -14.629294016186135,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: -14.629294016186133,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: -2.6292940159578393,
  //                   },
  //                   mtr: {
  //                     corner: {
  //                       bl: {
  //                         x: 47.94185256559156,
  //                         y: -36.129294015834176,
  //                       },
  //                       br: {
  //                         x: 60.941852565838886,
  //                         y: -36.129294015834176,
  //                       },
  //                       tl: {
  //                         x: 47.94185256559156,
  //                         y: -49.1292940160815,
  //                       },
  //                       tr: {
  //                         x: 60.941852565838886,
  //                         y: -49.1292940160815,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.441852565486926,
  //                         y: -30.629294015729545,
  //                       },
  //                       br: {
  //                         x: 66.44185256594352,
  //                         y: -30.629294015729542,
  //                       },
  //                       tl: {
  //                         x: 42.441852565486926,
  //                         y: -54.62929401618614,
  //                       },
  //                       tr: {
  //                         x: 66.44185256594352,
  //                         y: -54.62929401618614,
  //                       },
  //                     },
  //                     x: 54.44185256571522,
  //                     y: -42.62929401595784,
  //                   },
  //                   tl: {
  //                     corner: {
  //                       bl: {
  //                         x: -9.1292940160815,
  //                         y: 3.87070598416582,
  //                       },
  //                       br: {
  //                         x: 3.87070598416582,
  //                         y: 3.870705984165822,
  //                       },
  //                       tl: {
  //                         x: -9.129294016081499,
  //                         y: -9.1292940160815,
  //                       },
  //                       tr: {
  //                         x: 3.870705984165822,
  //                         y: -9.129294016081499,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -14.629294016186135,
  //                         y: 9.370705984270455,
  //                       },
  //                       br: {
  //                         x: 9.370705984270455,
  //                         y: 9.370705984270456,
  //                       },
  //                       tl: {
  //                         x: -14.629294016186133,
  //                         y: -14.629294016186135,
  //                       },
  //                       tr: {
  //                         x: 9.370705984270456,
  //                         y: -14.629294016186133,
  //                       },
  //                     },
  //                     x: -2.6292940159578393,
  //                     y: -2.6292940159578393,
  //                   },
  //                   tr: {
  //                     corner: {
  //                       bl: {
  //                         x: 105.01299914726462,
  //                         y: 3.87070598416582,
  //                       },
  //                       br: {
  //                         x: 118.01299914751195,
  //                         y: 3.870705984165822,
  //                       },
  //                       tl: {
  //                         x: 105.01299914726462,
  //                         y: -9.1292940160815,
  //                       },
  //                       tr: {
  //                         x: 118.01299914751195,
  //                         y: -9.129294016081499,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 99.51299914715999,
  //                         y: 9.370705984270455,
  //                       },
  //                       br: {
  //                         x: 123.51299914761658,
  //                         y: 9.370705984270456,
  //                       },
  //                       tl: {
  //                         x: 99.51299914715999,
  //                         y: -14.629294016186135,
  //                       },
  //                       tr: {
  //                         x: 123.51299914761658,
  //                         y: -14.629294016186133,
  //                       },
  //                     },
  //                     x: 111.51299914738829,
  //                     y: -2.6292940159578393,
  //                   },
  //                 },
  //                 objectCaching: true,
  //                 opacity: 1,
  //                 originX: 'left',
  //                 originY: 'top',
  //                 padding: 0,
  //                 paintFirst: 'fill',
  //                 scaleX: 1,
  //                 scaleY: 1,
  //                 selectable: false,
  //                 shadow: null,
  //                 skewX: 0,
  //                 skewY: 0,
  //                 src: 'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Frame.png',
  //                 stroke: null,
  //                 strokeDashArray: null,
  //                 strokeDashOffset: 0,
  //                 strokeLineCap: 'butt',
  //                 strokeLineJoin: 'miter',
  //                 strokeMiterLimit: 4,
  //                 strokeUniform: false,
  //                 strokeWidth: 0,
  //                 top: 1.4329999999999998,
  //                 type: 'image',
  //                 version: '5.2.1',
  //                 visible: true,
  //                 width: 1476,
  //               },
  //             ],
  //             selectionColor: 'rgba(100, 100, 255, 0.3)',
  //             version: '5.2.1',
  //           },
  //           Dimensions: {
  //             Height: 2114,
  //             Width: 1476,
  //           },
  //           EditableAreas: [],
  //           FaceId: 1,
  //           FrameUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Frame.png',
  //           IsEditable: true,
  //           OverlayBackgroundUrl: '',
  //           PhotoZones: [
  //             {
  //               Height: 1951.7098,
  //               LeftPosition: 21.259802,
  //               Rotation: 0,
  //               TopPosition: 45.70975,
  //               Width: 1363.6118,
  //             },
  //           ],
  //           PreviewUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Preview.png',
  //           ReplaceBackgroundUrl: '',
  //           Texts: [
  //             {
  //               FontFamily: 'OMG Hi',
  //               FontId: 120,
  //               FontSize: 26,
  //               Height: 184.72404,
  //               IsFixed: true,
  //               IsHybrid: false,
  //               IsMultiline: false,
  //               LeftPosition: 170.5662,
  //               Rotation: 0,
  //               Text: 'RYLEIGH',
  //               TextAlign: 'center',
  //               TextColor: '#FFFFFF',
  //               TopPosition: 1693.4612,
  //               Width: 1063.9987,
  //             },
  //           ],
  //           Type: 'front',
  //           UserImages: null,
  //           UserTextZones: [],
  //         },
  //         {
  //           BackgroundUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Background.png',
  //           CanvasJson: {
  //             backgroundImage: {
  //               angle: 0,
  //               backgroundColor: '',
  //               borderDashArray: null,
  //               cornerColor: 'rgb(178,204,255)',
  //               cropX: 0,
  //               cropY: 0,
  //               crossOrigin: 'anonymous',
  //               evented: true,
  //               fill: 'transparent',
  //               fillRule: 'nonzero',
  //               filters: [],
  //               flipX: false,
  //               flipY: false,
  //               globalCompositeOperation: 'source-over',
  //               hasControls: true,
  //               height: 2114,
  //               hoverCursor: null,
  //               left: 0,
  //               lockMovementX: false,
  //               lockMovementY: false,
  //               lockRotation: false,
  //               lockScalingFlip: false,
  //               lockSkewingX: false,
  //               minScaleLimit: 0,
  //               oCoords: {
  //                 bl: {
  //                   corner: {
  //                     bl: {
  //                       x: -24.21650000012366,
  //                       y: 1045.7835000001237,
  //                     },
  //                     br: {
  //                       x: -11.216499999876337,
  //                       y: 1045.7835000001237,
  //                     },
  //                     tl: {
  //                       x: -24.216500000123656,
  //                       y: 1032.7834999998763,
  //                     },
  //                     tr: {
  //                       x: -11.216499999876335,
  //                       y: 1032.7834999998763,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: -29.716500000228294,
  //                       y: 1051.2835000002283,
  //                     },
  //                     br: {
  //                       x: -5.7164999997717025,
  //                       y: 1051.2835000002283,
  //                     },
  //                     tl: {
  //                       x: -29.71650000022829,
  //                       y: 1027.2834999997717,
  //                     },
  //                     tr: {
  //                       x: -5.716499999771701,
  //                       y: 1027.2834999997717,
  //                     },
  //                   },
  //                   x: -17.716499999999996,
  //                   y: 1039.2835,
  //                 },
  //                 br: {
  //                   corner: {
  //                     bl: {
  //                       x: 1410.7834999998763,
  //                       y: 1045.7835000001237,
  //                     },
  //                     br: {
  //                       x: 1423.7835000001237,
  //                       y: 1045.7835000001237,
  //                     },
  //                     tl: {
  //                       x: 1410.7834999998763,
  //                       y: 1032.7834999998763,
  //                     },
  //                     tr: {
  //                       x: 1423.7835000001237,
  //                       y: 1032.7834999998763,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 1405.2834999997717,
  //                       y: 1051.2835000002283,
  //                     },
  //                     br: {
  //                       x: 1429.2835000002283,
  //                       y: 1051.2835000002283,
  //                     },
  //                     tl: {
  //                       x: 1405.2834999997717,
  //                       y: 1027.2834999997717,
  //                     },
  //                     tr: {
  //                       x: 1429.2835000002283,
  //                       y: 1027.2834999997717,
  //                     },
  //                   },
  //                   x: 1417.2835,
  //                   y: 1039.2835,
  //                 },
  //                 mb: {
  //                   corner: {
  //                     bl: {
  //                       x: 693.2834999998763,
  //                       y: 1045.7835000001237,
  //                     },
  //                     br: {
  //                       x: 706.2835000001237,
  //                       y: 1045.7835000001237,
  //                     },
  //                     tl: {
  //                       x: 693.2834999998763,
  //                       y: 1032.7834999998763,
  //                     },
  //                     tr: {
  //                       x: 706.2835000001237,
  //                       y: 1032.7834999998763,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 687.7834999997717,
  //                       y: 1051.2835000002283,
  //                     },
  //                     br: {
  //                       x: 711.7835000002283,
  //                       y: 1051.2835000002283,
  //                     },
  //                     tl: {
  //                       x: 687.7834999997717,
  //                       y: 1027.2834999997717,
  //                     },
  //                     tr: {
  //                       x: 711.7835000002283,
  //                       y: 1027.2834999997717,
  //                     },
  //                   },
  //                   x: 699.7835,
  //                   y: 1039.2835,
  //                 },
  //                 ml: {
  //                   corner: {
  //                     bl: {
  //                       x: -24.21650000012366,
  //                       y: 517.2835000001237,
  //                     },
  //                     br: {
  //                       x: -11.216499999876337,
  //                       y: 517.2835000001237,
  //                     },
  //                     tl: {
  //                       x: -24.216500000123656,
  //                       y: 504.28349999987637,
  //                     },
  //                     tr: {
  //                       x: -11.216499999876335,
  //                       y: 504.28349999987637,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: -29.716500000228294,
  //                       y: 522.7835000002283,
  //                     },
  //                     br: {
  //                       x: -5.7164999997717025,
  //                       y: 522.7835000002283,
  //                     },
  //                     tl: {
  //                       x: -29.71650000022829,
  //                       y: 498.7834999997717,
  //                     },
  //                     tr: {
  //                       x: -5.716499999771701,
  //                       y: 498.7834999997717,
  //                     },
  //                   },
  //                   x: -17.716499999999996,
  //                   y: 510.7835,
  //                 },
  //                 mr: {
  //                   corner: {
  //                     bl: {
  //                       x: 1410.7834999998763,
  //                       y: 517.2835000001237,
  //                     },
  //                     br: {
  //                       x: 1423.7835000001237,
  //                       y: 517.2835000001237,
  //                     },
  //                     tl: {
  //                       x: 1410.7834999998763,
  //                       y: 504.28349999987637,
  //                     },
  //                     tr: {
  //                       x: 1423.7835000001237,
  //                       y: 504.28349999987637,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 1405.2834999997717,
  //                       y: 522.7835000002283,
  //                     },
  //                     br: {
  //                       x: 1429.2835000002283,
  //                       y: 522.7835000002283,
  //                     },
  //                     tl: {
  //                       x: 1405.2834999997717,
  //                       y: 498.7834999997717,
  //                     },
  //                     tr: {
  //                       x: 1429.2835000002283,
  //                       y: 498.7834999997717,
  //                     },
  //                   },
  //                   x: 1417.2835,
  //                   y: 510.7835,
  //                 },
  //                 mt: {
  //                   corner: {
  //                     bl: {
  //                       x: 693.2834999998763,
  //                       y: -11.216499999876337,
  //                     },
  //                     br: {
  //                       x: 706.2835000001237,
  //                       y: -11.216499999876335,
  //                     },
  //                     tl: {
  //                       x: 693.2834999998763,
  //                       y: -24.21650000012366,
  //                     },
  //                     tr: {
  //                       x: 706.2835000001237,
  //                       y: -24.216500000123656,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 687.7834999997717,
  //                       y: -5.7164999997717025,
  //                     },
  //                     br: {
  //                       x: 711.7835000002283,
  //                       y: -5.716499999771701,
  //                     },
  //                     tl: {
  //                       x: 687.7834999997717,
  //                       y: -29.716500000228294,
  //                     },
  //                     tr: {
  //                       x: 711.7835000002283,
  //                       y: -29.71650000022829,
  //                     },
  //                   },
  //                   x: 699.7835,
  //                   y: -17.716499999999996,
  //                 },
  //                 mtr: {
  //                   corner: {
  //                     bl: {
  //                       x: 693.2834999998763,
  //                       y: -51.21649999987633,
  //                     },
  //                     br: {
  //                       x: 706.2835000001237,
  //                       y: -51.21649999987633,
  //                     },
  //                     tl: {
  //                       x: 693.2834999998763,
  //                       y: -64.21650000012366,
  //                     },
  //                     tr: {
  //                       x: 706.2835000001237,
  //                       y: -64.21650000012366,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 687.7834999997717,
  //                       y: -45.7164999997717,
  //                     },
  //                     br: {
  //                       x: 711.7835000002283,
  //                       y: -45.7164999997717,
  //                     },
  //                     tl: {
  //                       x: 687.7834999997717,
  //                       y: -69.7165000002283,
  //                     },
  //                     tr: {
  //                       x: 711.7835000002283,
  //                       y: -69.7165000002283,
  //                     },
  //                   },
  //                   x: 699.7835,
  //                   y: -57.716499999999996,
  //                 },
  //                 tl: {
  //                   corner: {
  //                     bl: {
  //                       x: -24.21650000012366,
  //                       y: -11.216499999876337,
  //                     },
  //                     br: {
  //                       x: -11.216499999876337,
  //                       y: -11.216499999876335,
  //                     },
  //                     tl: {
  //                       x: -24.216500000123656,
  //                       y: -24.21650000012366,
  //                     },
  //                     tr: {
  //                       x: -11.216499999876335,
  //                       y: -24.216500000123656,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: -29.716500000228294,
  //                       y: -5.7164999997717025,
  //                     },
  //                     br: {
  //                       x: -5.7164999997717025,
  //                       y: -5.716499999771701,
  //                     },
  //                     tl: {
  //                       x: -29.71650000022829,
  //                       y: -29.716500000228294,
  //                     },
  //                     tr: {
  //                       x: -5.716499999771701,
  //                       y: -29.71650000022829,
  //                     },
  //                   },
  //                   x: -17.716499999999996,
  //                   y: -17.716499999999996,
  //                 },
  //                 tr: {
  //                   corner: {
  //                     bl: {
  //                       x: 1410.7834999998763,
  //                       y: -11.216499999876337,
  //                     },
  //                     br: {
  //                       x: 1423.7835000001237,
  //                       y: -11.216499999876335,
  //                     },
  //                     tl: {
  //                       x: 1410.7834999998763,
  //                       y: -24.21650000012366,
  //                     },
  //                     tr: {
  //                       x: 1423.7835000001237,
  //                       y: -24.216500000123656,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 1405.2834999997717,
  //                       y: -5.7164999997717025,
  //                     },
  //                     br: {
  //                       x: 1429.2835000002283,
  //                       y: -5.716499999771701,
  //                     },
  //                     tl: {
  //                       x: 1405.2834999997717,
  //                       y: -29.716500000228294,
  //                     },
  //                     tr: {
  //                       x: 1429.2835000002283,
  //                       y: -29.71650000022829,
  //                     },
  //                   },
  //                   x: 1417.2835,
  //                   y: -17.716499999999996,
  //                 },
  //               },
  //               objectCaching: true,
  //               opacity: 1,
  //               originX: 'left',
  //               originY: 'top',
  //               padding: 0,
  //               paintFirst: 'fill',
  //               scaleX: 1,
  //               scaleY: 1,
  //               selectable: true,
  //               shadow: null,
  //               skewX: 0,
  //               skewY: 0,
  //               src: 'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Background.png?w=2870',
  //               stroke: null,
  //               strokeDashArray: null,
  //               strokeDashOffset: 0,
  //               strokeLineCap: 'butt',
  //               strokeLineJoin: 'miter',
  //               strokeMiterLimit: 4,
  //               strokeUniform: false,
  //               strokeWidth: 0,
  //               top: 0,
  //               type: 'image',
  //               version: '5.2.1',
  //               visible: true,
  //               width: 2870,
  //             },
  //             hoverCursor: 'move',
  //             objects: [
  //               {
  //                 angle: 25,
  //                 backgroundColor: '',
  //                 borderDashArray: null,
  //                 cornerColor: 'rgb(178,204,255)',
  //                 cropX: 0,
  //                 cropY: 0,
  //                 crossOrigin: 'anonymous',
  //                 data: {
  //                   type: 'userImage',
  //                 },
  //                 evented: true,
  //                 fill: 'rgb(0,0,0)',
  //                 fillRule: 'nonzero',
  //                 filters: [],
  //                 flipX: false,
  //                 flipY: false,
  //                 globalCompositeOperation: 'source-over',
  //                 hasControls: true,
  //                 height: 6000,
  //                 hoverCursor: null,
  //                 left: 1866.433,
  //                 lockMovementX: false,
  //                 lockMovementY: false,
  //                 lockRotation: false,
  //                 lockScalingFlip: false,
  //                 lockSkewingX: false,
  //                 minScaleLimit: 0,
  //                 name: '9a7b56b7-26a9-428b-9fe7-f726c9a89589',
  //                 oCoords: {
  //                   bl: {
  //                     corner: {
  //                       bl: {
  //                         x: 81.97329195563745,
  //                         y: 114.37550336574095,
  //                       },
  //                       br: {
  //                         x: 93.75529318733804,
  //                         y: 119.86954076847456,
  //                       },
  //                       tl: {
  //                         x: 87.46732935837106,
  //                         y: 102.59350213404036,
  //                       },
  //                       tr: {
  //                         x: 99.24933059007165,
  //                         y: 108.08753953677397,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 74.66419868722296,
  //                         y: 117.03579575491929,
  //                       },
  //                       br: {
  //                         x: 96.41558557651638,
  //                         y: 127.17863403688905,
  //                       },
  //                       tl: {
  //                         x: 84.80703696919272,
  //                         y: 95.28440886562588,
  //                       },
  //                       tr: {
  //                         x: 106.55842385848614,
  //                         y: 105.42724714759564,
  //                       },
  //                     },
  //                     x: 90.61131127285455,
  //                     y: 111.23152145125746,
  //                   },
  //                   br: {
  //                     corner: {
  //                       bl: {
  //                         x: 154.86351627076428,
  //                         y: 148.3647731685203,
  //                       },
  //                       br: {
  //                         x: 166.64551750246488,
  //                         y: 153.85881057125388,
  //                       },
  //                       tl: {
  //                         x: 160.35755367349788,
  //                         y: 136.58277193681968,
  //                       },
  //                       tr: {
  //                         x: 172.13955490519848,
  //                         y: 142.07680933955328,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 147.5544230023498,
  //                         y: 151.0250655576986,
  //                       },
  //                       br: {
  //                         x: 169.3058098916432,
  //                         y: 161.16790383966836,
  //                       },
  //                       tl: {
  //                         x: 157.69726128431955,
  //                         y: 129.2736786684052,
  //                       },
  //                       tr: {
  //                         x: 179.44864817361295,
  //                         y: 139.41651695037496,
  //                       },
  //                     },
  //                     x: 163.50153558798138,
  //                     y: 145.22079125403678,
  //                   },
  //                   mb: {
  //                     corner: {
  //                       bl: {
  //                         x: 118.41840411320086,
  //                         y: 131.37013826713064,
  //                       },
  //                       br: {
  //                         x: 130.20040534490147,
  //                         y: 136.86417566986424,
  //                       },
  //                       tl: {
  //                         x: 123.91244151593447,
  //                         y: 119.58813703543004,
  //                       },
  //                       tr: {
  //                         x: 135.69444274763507,
  //                         y: 125.08217443816365,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 111.10931084478638,
  //                         y: 134.03043065630897,
  //                       },
  //                       br: {
  //                         x: 132.8606977340798,
  //                         y: 144.1732689382787,
  //                       },
  //                       tl: {
  //                         x: 121.25214912675614,
  //                         y: 112.27904376701555,
  //                       },
  //                       tr: {
  //                         x: 143.00353601604954,
  //                         y: 122.42188204898531,
  //                       },
  //                     },
  //                     x: 127.05642343041796,
  //                     y: 128.22615635264714,
  //                   },
  //                   ml: {
  //                     corner: {
  //                       bl: {
  //                         x: 107.46524430772195,
  //                         y: 59.70783512939584,
  //                       },
  //                       br: {
  //                         x: 119.24724553942254,
  //                         y: 65.20187253212946,
  //                       },
  //                       tl: {
  //                         x: 112.95928171045556,
  //                         y: 47.92583389769524,
  //                       },
  //                       tr: {
  //                         x: 124.74128294215615,
  //                         y: 53.41987130042886,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 100.15615103930746,
  //                         y: 62.36812751857418,
  //                       },
  //                       br: {
  //                         x: 121.90753792860087,
  //                         y: 72.51096580054393,
  //                       },
  //                       tl: {
  //                         x: 110.29898932127722,
  //                         y: 40.61674062928077,
  //                       },
  //                       tr: {
  //                         x: 132.05037621057062,
  //                         y: 50.75957891125052,
  //                       },
  //                     },
  //                     x: 116.10326362493905,
  //                     y: 56.56385321491235,
  //                   },
  //                   mr: {
  //                     corner: {
  //                       bl: {
  //                         x: 180.35546862284878,
  //                         y: 93.69710493217518,
  //                       },
  //                       br: {
  //                         x: 192.13746985454938,
  //                         y: 99.19114233490879,
  //                       },
  //                       tl: {
  //                         x: 185.84950602558237,
  //                         y: 81.91510370047459,
  //                       },
  //                       tr: {
  //                         x: 197.63150725728298,
  //                         y: 87.4091411032082,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 173.0463753544343,
  //                         y: 96.35739732135352,
  //                       },
  //                       br: {
  //                         x: 194.7977622437277,
  //                         y: 106.50023560332328,
  //                       },
  //                       tl: {
  //                         x: 183.18921363640405,
  //                         y: 74.6060104320601,
  //                       },
  //                       tr: {
  //                         x: 204.94060052569745,
  //                         y: 84.74884871402986,
  //                       },
  //                     },
  //                     x: 188.99348794006588,
  //                     y: 90.55312301769169,
  //                   },
  //                   mt: {
  //                     corner: {
  //                       bl: {
  //                         x: 169.40230881736986,
  //                         y: 22.03480179444039,
  //                       },
  //                       br: {
  //                         x: 181.18431004907046,
  //                         y: 27.52883919717401,
  //                       },
  //                       tl: {
  //                         x: 174.89634622010345,
  //                         y: 10.252800562739793,
  //                       },
  //                       tr: {
  //                         x: 186.67834745180406,
  //                         y: 15.746837965473409,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 162.09321554895538,
  //                         y: 24.695094183618732,
  //                       },
  //                       br: {
  //                         x: 183.84460243824878,
  //                         y: 34.83793246558848,
  //                       },
  //                       tl: {
  //                         x: 172.23605383092513,
  //                         y: 2.9437072943253195,
  //                       },
  //                       tr: {
  //                         x: 193.98744072021853,
  //                         y: 13.08654557629507,
  //                       },
  //                     },
  //                     x: 178.04032813458696,
  //                     y: 18.8908198799569,
  //                   },
  //                   mtr: {
  //                     corner: {
  //                       bl: {
  //                         x: 186.30703928699782,
  //                         y: -14.217509687025595,
  //                       },
  //                       br: {
  //                         x: 198.08904051869843,
  //                         y: -8.72347228429198,
  //                       },
  //                       tl: {
  //                         x: 191.80107668973142,
  //                         y: -25.999510918726195,
  //                       },
  //                       tr: {
  //                         x: 203.58307792143202,
  //                         y: -20.505473515992577,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 178.99794601858335,
  //                         y: -11.557217297847256,
  //                       },
  //                       br: {
  //                         x: 200.74933290787675,
  //                         y: -1.4143790158775058,
  //                       },
  //                       tl: {
  //                         x: 189.1407843005531,
  //                         y: -33.308604187140666,
  //                       },
  //                       tr: {
  //                         x: 210.8921711898465,
  //                         y: -23.165765905170918,
  //                       },
  //                     },
  //                     x: 194.94505860421492,
  //                     y: -17.361491601509087,
  //                   },
  //                   tl: {
  //                     corner: {
  //                       bl: {
  //                         x: 132.95719665980644,
  //                         y: 5.040166893050726,
  //                       },
  //                       br: {
  //                         x: 144.73919789150705,
  //                         y: 10.534204295784342,
  //                       },
  //                       tl: {
  //                         x: 138.45123406254004,
  //                         y: -6.741834338649873,
  //                       },
  //                       tr: {
  //                         x: 150.23323529424064,
  //                         y: -1.247796935916257,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 125.64810339139196,
  //                         y: 7.7004592822290645,
  //                       },
  //                       br: {
  //                         x: 147.39949028068537,
  //                         y: 17.843297564198814,
  //                       },
  //                       tl: {
  //                         x: 135.79094167336171,
  //                         y: -14.050927607064347,
  //                       },
  //                       tr: {
  //                         x: 157.54232856265511,
  //                         y: -3.908089325094596,
  //                       },
  //                     },
  //                     x: 141.59521597702354,
  //                     y: 1.8961849785672342,
  //                   },
  //                   tr: {
  //                     corner: {
  //                       bl: {
  //                         x: 205.84742097493327,
  //                         y: 39.02943669583006,
  //                       },
  //                       br: {
  //                         x: 217.62942220663388,
  //                         y: 44.523474098563675,
  //                       },
  //                       tl: {
  //                         x: 211.34145837766687,
  //                         y: 27.24743546412946,
  //                       },
  //                       tr: {
  //                         x: 223.12345960936747,
  //                         y: 32.74147286686308,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 198.5383277065188,
  //                         y: 41.689729085008395,
  //                       },
  //                       br: {
  //                         x: 220.2897145958122,
  //                         y: 51.83256736697815,
  //                       },
  //                       tl: {
  //                         x: 208.68116598848854,
  //                         y: 19.938342195714988,
  //                       },
  //                       tr: {
  //                         x: 230.43255287778194,
  //                         y: 30.081180477684736,
  //                       },
  //                     },
  //                     x: 214.48544029215037,
  //                     y: 35.88545478134657,
  //                   },
  //                 },
  //                 objectCaching: true,
  //                 opacity: 1,
  //                 originX: 'left',
  //                 originY: 'top',
  //                 padding: 0,
  //                 paintFirst: 'fill',
  //                 scaleX: 0.26,
  //                 scaleY: 0.26,
  //                 selectable: true,
  //                 shadow: null,
  //                 skewX: 0,
  //                 skewY: 0,
  //                 src: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/b74d1bd7-6798-41b6-b53b-a4b7d4bdd0c46158972322187069841.jpg?1680087831522',
  //                 stroke: null,
  //                 strokeDashArray: null,
  //                 strokeDashOffset: 0,
  //                 strokeLineCap: 'butt',
  //                 strokeLineJoin: 'miter',
  //                 strokeMiterLimit: 4,
  //                 strokeUniform: false,
  //                 strokeWidth: 0,
  //                 top: 59.953,
  //                 type: 'image',
  //                 version: '5.2.1',
  //                 visible: true,
  //                 width: 4000,
  //               },
  //               {
  //                 angle: 25,
  //                 backgroundColor: '',
  //                 borderDashArray: null,
  //                 charSpacing: 0,
  //                 cornerColor: 'rgb(178,204,255)',
  //                 data: {
  //                   edited: true,
  //                   type: 'user-text',
  //                 },
  //                 direction: 'ltr',
  //                 editable: true,
  //                 editingBorderColor: 'rgba(102,153,255,0.25)',
  //                 evented: true,
  //                 fill: '#000000',
  //                 fillRule: 'nonzero',
  //                 flipX: false,
  //                 flipY: false,
  //                 fontFamily: 'fontid-115',
  //                 fontSize: 150,
  //                 fontStyle: 'normal',
  //                 fontWeight: 'normal',
  //                 globalCompositeOperation: 'source-over',
  //                 hasControls: true,
  //                 height: 562.74,
  //                 hoverCursor: null,
  //                 left: 388.953,
  //                 lineHeight: 1.16,
  //                 linethrough: false,
  //                 lockMovementX: false,
  //                 lockMovementY: false,
  //                 lockRotation: false,
  //                 lockScalingFlip: true,
  //                 lockSkewingX: false,
  //                 minScaleLimit: 0,
  //                 minWidth: 20,
  //                 oCoords: {
  //                   bl: {
  //                     corner: {
  //                       bl: {
  //                         x: -18.361339951006762,
  //                         y: 111.7967771931752,
  //                       },
  //                       br: {
  //                         x: -6.579338719306163,
  //                         y: 117.29081459590881,
  //                       },
  //                       tl: {
  //                         x: -12.867302548273146,
  //                         y: 100.01477596147461,
  //                       },
  //                       tr: {
  //                         x: -1.0853013165725471,
  //                         y: 105.50881336420822,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -25.670433219421234,
  //                         y: 114.45706958235354,
  //                       },
  //                       br: {
  //                         x: -3.9190463301278244,
  //                         y: 124.5999078643233,
  //                       },
  //                       tl: {
  //                         x: -15.527594937451486,
  //                         y: 92.70568269306013,
  //                       },
  //                       tr: {
  //                         x: 6.2237919518419265,
  //                         y: 102.84852097502988,
  //                       },
  //                     },
  //                     x: -9.723320633789655,
  //                     y: 108.65279527869171,
  //                   },
  //                   br: {
  //                     corner: {
  //                       bl: {
  //                         x: 58.15477911849582,
  //                         y: 147.47682948758398,
  //                       },
  //                       br: {
  //                         x: 69.93678035019641,
  //                         y: 152.97086689031758,
  //                       },
  //                       tl: {
  //                         x: 63.648816521229435,
  //                         y: 135.69482825588338,
  //                       },
  //                       tr: {
  //                         x: 75.43081775293004,
  //                         y: 141.18886565861698,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 50.845685850081345,
  //                         y: 150.1371218767623,
  //                       },
  //                       br: {
  //                         x: 72.59707273937475,
  //                         y: 160.27996015873205,
  //                       },
  //                       tl: {
  //                         x: 60.9885241320511,
  //                         y: 128.3857349874689,
  //                       },
  //                       tr: {
  //                         x: 82.73991102134451,
  //                         y: 138.52857326943865,
  //                       },
  //                     },
  //                     x: 66.79279843571292,
  //                     y: 144.33284757310048,
  //                   },
  //                   mb: {
  //                     corner: {
  //                       bl: {
  //                         x: 19.896719583744527,
  //                         y: 129.6368033403796,
  //                       },
  //                       br: {
  //                         x: 31.678720815445125,
  //                         y: 135.1308407431132,
  //                       },
  //                       tl: {
  //                         x: 25.390756986478145,
  //                         y: 117.854802108679,
  //                       },
  //                       tr: {
  //                         x: 37.17275821817874,
  //                         y: 123.3488395114126,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 12.587626315330054,
  //                         y: 132.29709572955792,
  //                       },
  //                       br: {
  //                         x: 34.33901320462346,
  //                         y: 142.43993401152767,
  //                       },
  //                       tl: {
  //                         x: 22.730464597299804,
  //                         y: 110.54570884026451,
  //                       },
  //                       tr: {
  //                         x: 44.481851486593214,
  //                         y: 120.68854712223427,
  //                       },
  //                     },
  //                     x: 28.534738900961635,
  //                     y: 126.4928214258961,
  //                   },
  //                   ml: {
  //                     corner: {
  //                       bl: {
  //                         x: -3.21627071528043,
  //                         y: 79.31807140556369,
  //                       },
  //                       br: {
  //                         x: 8.56573051642017,
  //                         y: 84.8121088082973,
  //                       },
  //                       tl: {
  //                         x: 2.277766687453186,
  //                         y: 67.5360701738631,
  //                       },
  //                       tr: {
  //                         x: 14.059767919153785,
  //                         y: 73.0301075765967,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: -10.525363983694904,
  //                         y: 81.97836379474202,
  //                       },
  //                       br: {
  //                         x: 11.226022905598509,
  //                         y: 92.12120207671178,
  //                       },
  //                       tl: {
  //                         x: -0.3825257017251529,
  //                         y: 60.226976905448616,
  //                       },
  //                       tr: {
  //                         x: 21.368861187568257,
  //                         y: 70.36981518741837,
  //                       },
  //                     },
  //                     x: 5.421748601936677,
  //                     y: 76.1740894910802,
  //                   },
  //                   mr: {
  //                     corner: {
  //                       bl: {
  //                         x: 73.29984835422215,
  //                         y: 114.99812369997245,
  //                       },
  //                       br: {
  //                         x: 85.08184958592274,
  //                         y: 120.49216110270606,
  //                       },
  //                       tl: {
  //                         x: 78.79388575695576,
  //                         y: 103.21612246827186,
  //                       },
  //                       tr: {
  //                         x: 90.57588698865635,
  //                         y: 108.71015987100547,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 65.99075508580766,
  //                         y: 117.65841608915079,
  //                       },
  //                       br: {
  //                         x: 87.74214197510108,
  //                         y: 127.80125437112055,
  //                       },
  //                       tl: {
  //                         x: 76.13359336777742,
  //                         y: 95.90702919985738,
  //                       },
  //                       tr: {
  //                         x: 97.88498025707084,
  //                         y: 106.04986748182714,
  //                       },
  //                     },
  //                     x: 81.93786767143925,
  //                     y: 111.85414178548896,
  //                   },
  //                   mt: {
  //                     corner: {
  //                       bl: {
  //                         x: 50.18685805519719,
  //                         y: 64.67939176515655,
  //                       },
  //                       br: {
  //                         x: 61.96885928689779,
  //                         y: 70.17342916789016,
  //                       },
  //                       tl: {
  //                         x: 55.68089545793081,
  //                         y: 52.89739053345595,
  //                       },
  //                       tr: {
  //                         x: 67.4628966896314,
  //                         y: 58.391427936189565,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 42.87776478678272,
  //                         y: 67.33968415433489,
  //                       },
  //                       br: {
  //                         x: 64.62915167607613,
  //                         y: 77.48252243630463,
  //                       },
  //                       tl: {
  //                         x: 53.02060306875247,
  //                         y: 45.588297265041476,
  //                       },
  //                       tr: {
  //                         x: 74.77198995804588,
  //                         y: 55.73113554701123,
  //                       },
  //                     },
  //                     x: 58.8248773724143,
  //                     y: 61.535409850673055,
  //                   },
  //                   mtr: {
  //                     corner: {
  //                       bl: {
  //                         x: 67.09158852482517,
  //                         y: 28.427080283690543,
  //                       },
  //                       br: {
  //                         x: 78.87358975652576,
  //                         y: 33.92111768642416,
  //                       },
  //                       tl: {
  //                         x: 72.58562592755878,
  //                         y: 16.645079051989946,
  //                       },
  //                       tr: {
  //                         x: 84.36762715925937,
  //                         y: 22.139116454723563,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 59.78249525641069,
  //                         y: 31.087372672868884,
  //                       },
  //                       br: {
  //                         x: 81.5338821457041,
  //                         y: 41.23021095483863,
  //                       },
  //                       tl: {
  //                         x: 69.92533353838044,
  //                         y: 9.335985783575472,
  //                       },
  //                       tr: {
  //                         x: 91.67672042767386,
  //                         y: 19.478824065545222,
  //                       },
  //                     },
  //                     x: 75.72960784204227,
  //                     y: 25.283098369207053,
  //                   },
  //                   tl: {
  //                     corner: {
  //                       bl: {
  //                         x: 11.928798520445902,
  //                         y: 46.839365617952154,
  //                       },
  //                       br: {
  //                         x: 23.7107997521465,
  //                         y: 52.33340302068577,
  //                       },
  //                       tl: {
  //                         x: 17.42283592317952,
  //                         y: 35.05736438625156,
  //                       },
  //                       tr: {
  //                         x: 29.204837154880117,
  //                         y: 40.551401788985174,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 4.619705252031428,
  //                         y: 49.49965800713049,
  //                       },
  //                       br: {
  //                         x: 26.37109214132484,
  //                         y: 59.642496289100244,
  //                       },
  //                       tl: {
  //                         x: 14.762543534001178,
  //                         y: 27.748271117837085,
  //                       },
  //                       tr: {
  //                         x: 36.51393042329459,
  //                         y: 37.89110939980684,
  //                       },
  //                     },
  //                     x: 20.56681783766301,
  //                     y: 43.695383703468664,
  //                   },
  //                   tr: {
  //                     corner: {
  //                       bl: {
  //                         x: 88.44491758994849,
  //                         y: 82.51941791236094,
  //                       },
  //                       br: {
  //                         x: 100.22691882164908,
  //                         y: 88.01345531509455,
  //                       },
  //                       tl: {
  //                         x: 93.9389549926821,
  //                         y: 70.73741668066035,
  //                       },
  //                       tr: {
  //                         x: 105.72095622438269,
  //                         y: 76.23145408339396,
  //                       },
  //                     },
  //                     touchCorner: {
  //                       bl: {
  //                         x: 81.135824321534,
  //                         y: 85.17971030153927,
  //                       },
  //                       br: {
  //                         x: 102.88721121082742,
  //                         y: 95.32254858350903,
  //                       },
  //                       tl: {
  //                         x: 91.27866260350376,
  //                         y: 63.42832341224587,
  //                       },
  //                       tr: {
  //                         x: 113.03004949279718,
  //                         y: 73.57116169421562,
  //                       },
  //                     },
  //                     x: 97.08293690716559,
  //                     y: 79.37543599787745,
  //                   },
  //                 },
  //                 objectCaching: true,
  //                 opacity: 1,
  //                 originX: 'left',
  //                 originY: 'top',
  //                 overline: false,
  //                 padding: 14,
  //                 paintFirst: 'fill',
  //                 path: null,
  //                 pathAlign: 'baseline',
  //                 pathSide: 'left',
  //                 pathStartOffset: 0,
  //                 scaleX: 1,
  //                 scaleY: 1,
  //                 selectable: true,
  //                 selectionColor: 'rgba(17,119,255,0.3)',
  //                 selectionEnd: 9,
  //                 selectionStart: 9,
  //                 shadow: null,
  //                 skewX: 0,
  //                 skewY: 0,
  //                 splitByGrapheme: false,
  //                 stroke: null,
  //                 strokeDashArray: null,
  //                 strokeDashOffset: 0,
  //                 strokeLineCap: 'butt',
  //                 strokeLineJoin: 'miter',
  //                 strokeMiterLimit: 4,
  //                 strokeUniform: false,
  //                 strokeWidth: 1,
  //                 styles: {},
  //                 text: 'hAPPY bIRTHDAY sHRIKANT',
  //                 textAlign: 'left',
  //                 textBackgroundColor: '',
  //                 top: 841.053,
  //                 type: 'textbox',
  //                 underline: false,
  //                 version: '5.2.1',
  //                 visible: true,
  //                 width: 727.66,
  //               },
  //             ],
  //             selectionColor: 'rgba(100, 100, 255, 0.3)',
  //             version: '5.2.1',
  //           },
  //           Dimensions: {
  //             Height: 2114,
  //             Width: 2870,
  //           },
  //           EditableAreas: [],
  //           FaceId: 2,
  //           FrameUrl: '',
  //           IsEditable: true,
  //           OverlayBackgroundUrl: '',
  //           PhotoZones: [],
  //           PreviewUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Preview.png',
  //           ReplaceBackgroundUrl: '',
  //           Texts: [],
  //           Type: 'inside',
  //           UserImages: null,
  //           UserTextZones: [],
  //         },
  //         {
  //           BackgroundUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Background.png',
  //           CanvasJson: {
  //             backgroundImage: {
  //               angle: 0,
  //               backgroundColor: '',
  //               borderDashArray: null,
  //               cornerColor: 'rgb(178,204,255)',
  //               cropX: 0,
  //               cropY: 0,
  //               crossOrigin: 'anonymous',
  //               evented: true,
  //               fill: 'transparent',
  //               fillRule: 'nonzero',
  //               filters: [],
  //               flipX: false,
  //               flipY: false,
  //               globalCompositeOperation: 'source-over',
  //               hasControls: true,
  //               height: 2114,
  //               hoverCursor: null,
  //               left: 0,
  //               lockMovementX: false,
  //               lockMovementY: false,
  //               lockRotation: false,
  //               lockScalingFlip: false,
  //               lockSkewingX: false,
  //               minScaleLimit: 0,
  //               oCoords: {
  //                 bl: {
  //                   corner: {
  //                     bl: {
  //                       x: -24.21650000012366,
  //                       y: 1045.7835000001237,
  //                     },
  //                     br: {
  //                       x: -11.216499999876337,
  //                       y: 1045.7835000001237,
  //                     },
  //                     tl: {
  //                       x: -24.216500000123656,
  //                       y: 1032.7834999998763,
  //                     },
  //                     tr: {
  //                       x: -11.216499999876335,
  //                       y: 1032.7834999998763,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: -29.716500000228294,
  //                       y: 1051.2835000002283,
  //                     },
  //                     br: {
  //                       x: -5.7164999997717025,
  //                       y: 1051.2835000002283,
  //                     },
  //                     tl: {
  //                       x: -29.71650000022829,
  //                       y: 1027.2834999997717,
  //                     },
  //                     tr: {
  //                       x: -5.716499999771701,
  //                       y: 1027.2834999997717,
  //                     },
  //                   },
  //                   x: -17.716499999999996,
  //                   y: 1039.2835,
  //                 },
  //                 br: {
  //                   corner: {
  //                     bl: {
  //                       x: 672.7834999998763,
  //                       y: 1045.7835000001237,
  //                     },
  //                     br: {
  //                       x: 685.7835000001237,
  //                       y: 1045.7835000001237,
  //                     },
  //                     tl: {
  //                       x: 672.7834999998763,
  //                       y: 1032.7834999998763,
  //                     },
  //                     tr: {
  //                       x: 685.7835000001237,
  //                       y: 1032.7834999998763,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 667.2834999997717,
  //                       y: 1051.2835000002283,
  //                     },
  //                     br: {
  //                       x: 691.2835000002283,
  //                       y: 1051.2835000002283,
  //                     },
  //                     tl: {
  //                       x: 667.2834999997717,
  //                       y: 1027.2834999997717,
  //                     },
  //                     tr: {
  //                       x: 691.2835000002283,
  //                       y: 1027.2834999997717,
  //                     },
  //                   },
  //                   x: 679.2835,
  //                   y: 1039.2835,
  //                 },
  //                 mb: {
  //                   corner: {
  //                     bl: {
  //                       x: 324.28349999987637,
  //                       y: 1045.7835000001237,
  //                     },
  //                     br: {
  //                       x: 337.28350000012364,
  //                       y: 1045.7835000001237,
  //                     },
  //                     tl: {
  //                       x: 324.28349999987637,
  //                       y: 1032.7834999998763,
  //                     },
  //                     tr: {
  //                       x: 337.28350000012364,
  //                       y: 1032.7834999998763,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 318.7834999997717,
  //                       y: 1051.2835000002283,
  //                     },
  //                     br: {
  //                       x: 342.7835000002283,
  //                       y: 1051.2835000002283,
  //                     },
  //                     tl: {
  //                       x: 318.7834999997717,
  //                       y: 1027.2834999997717,
  //                     },
  //                     tr: {
  //                       x: 342.7835000002283,
  //                       y: 1027.2834999997717,
  //                     },
  //                   },
  //                   x: 330.7835,
  //                   y: 1039.2835,
  //                 },
  //                 ml: {
  //                   corner: {
  //                     bl: {
  //                       x: -24.21650000012366,
  //                       y: 517.2835000001237,
  //                     },
  //                     br: {
  //                       x: -11.216499999876337,
  //                       y: 517.2835000001237,
  //                     },
  //                     tl: {
  //                       x: -24.216500000123656,
  //                       y: 504.28349999987637,
  //                     },
  //                     tr: {
  //                       x: -11.216499999876335,
  //                       y: 504.28349999987637,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: -29.716500000228294,
  //                       y: 522.7835000002283,
  //                     },
  //                     br: {
  //                       x: -5.7164999997717025,
  //                       y: 522.7835000002283,
  //                     },
  //                     tl: {
  //                       x: -29.71650000022829,
  //                       y: 498.7834999997717,
  //                     },
  //                     tr: {
  //                       x: -5.716499999771701,
  //                       y: 498.7834999997717,
  //                     },
  //                   },
  //                   x: -17.716499999999996,
  //                   y: 510.7835,
  //                 },
  //                 mr: {
  //                   corner: {
  //                     bl: {
  //                       x: 672.7834999998763,
  //                       y: 517.2835000001237,
  //                     },
  //                     br: {
  //                       x: 685.7835000001237,
  //                       y: 517.2835000001237,
  //                     },
  //                     tl: {
  //                       x: 672.7834999998763,
  //                       y: 504.28349999987637,
  //                     },
  //                     tr: {
  //                       x: 685.7835000001237,
  //                       y: 504.28349999987637,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 667.2834999997717,
  //                       y: 522.7835000002283,
  //                     },
  //                     br: {
  //                       x: 691.2835000002283,
  //                       y: 522.7835000002283,
  //                     },
  //                     tl: {
  //                       x: 667.2834999997717,
  //                       y: 498.7834999997717,
  //                     },
  //                     tr: {
  //                       x: 691.2835000002283,
  //                       y: 498.7834999997717,
  //                     },
  //                   },
  //                   x: 679.2835,
  //                   y: 510.7835,
  //                 },
  //                 mt: {
  //                   corner: {
  //                     bl: {
  //                       x: 324.28349999987637,
  //                       y: -11.216499999876337,
  //                     },
  //                     br: {
  //                       x: 337.28350000012364,
  //                       y: -11.216499999876335,
  //                     },
  //                     tl: {
  //                       x: 324.28349999987637,
  //                       y: -24.21650000012366,
  //                     },
  //                     tr: {
  //                       x: 337.28350000012364,
  //                       y: -24.216500000123656,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 318.7834999997717,
  //                       y: -5.7164999997717025,
  //                     },
  //                     br: {
  //                       x: 342.7835000002283,
  //                       y: -5.716499999771701,
  //                     },
  //                     tl: {
  //                       x: 318.7834999997717,
  //                       y: -29.716500000228294,
  //                     },
  //                     tr: {
  //                       x: 342.7835000002283,
  //                       y: -29.71650000022829,
  //                     },
  //                   },
  //                   x: 330.7835,
  //                   y: -17.716499999999996,
  //                 },
  //                 mtr: {
  //                   corner: {
  //                     bl: {
  //                       x: 324.28349999987637,
  //                       y: -51.21649999987633,
  //                     },
  //                     br: {
  //                       x: 337.28350000012364,
  //                       y: -51.21649999987633,
  //                     },
  //                     tl: {
  //                       x: 324.28349999987637,
  //                       y: -64.21650000012366,
  //                     },
  //                     tr: {
  //                       x: 337.28350000012364,
  //                       y: -64.21650000012366,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 318.7834999997717,
  //                       y: -45.7164999997717,
  //                     },
  //                     br: {
  //                       x: 342.7835000002283,
  //                       y: -45.7164999997717,
  //                     },
  //                     tl: {
  //                       x: 318.7834999997717,
  //                       y: -69.7165000002283,
  //                     },
  //                     tr: {
  //                       x: 342.7835000002283,
  //                       y: -69.7165000002283,
  //                     },
  //                   },
  //                   x: 330.7835,
  //                   y: -57.716499999999996,
  //                 },
  //                 tl: {
  //                   corner: {
  //                     bl: {
  //                       x: -24.21650000012366,
  //                       y: -11.216499999876337,
  //                     },
  //                     br: {
  //                       x: -11.216499999876337,
  //                       y: -11.216499999876335,
  //                     },
  //                     tl: {
  //                       x: -24.216500000123656,
  //                       y: -24.21650000012366,
  //                     },
  //                     tr: {
  //                       x: -11.216499999876335,
  //                       y: -24.216500000123656,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: -29.716500000228294,
  //                       y: -5.7164999997717025,
  //                     },
  //                     br: {
  //                       x: -5.7164999997717025,
  //                       y: -5.716499999771701,
  //                     },
  //                     tl: {
  //                       x: -29.71650000022829,
  //                       y: -29.716500000228294,
  //                     },
  //                     tr: {
  //                       x: -5.716499999771701,
  //                       y: -29.71650000022829,
  //                     },
  //                   },
  //                   x: -17.716499999999996,
  //                   y: -17.716499999999996,
  //                 },
  //                 tr: {
  //                   corner: {
  //                     bl: {
  //                       x: 672.7834999998763,
  //                       y: -11.216499999876337,
  //                     },
  //                     br: {
  //                       x: 685.7835000001237,
  //                       y: -11.216499999876335,
  //                     },
  //                     tl: {
  //                       x: 672.7834999998763,
  //                       y: -24.21650000012366,
  //                     },
  //                     tr: {
  //                       x: 685.7835000001237,
  //                       y: -24.216500000123656,
  //                     },
  //                   },
  //                   touchCorner: {
  //                     bl: {
  //                       x: 667.2834999997717,
  //                       y: -5.7164999997717025,
  //                     },
  //                     br: {
  //                       x: 691.2835000002283,
  //                       y: -5.716499999771701,
  //                     },
  //                     tl: {
  //                       x: 667.2834999997717,
  //                       y: -29.716500000228294,
  //                     },
  //                     tr: {
  //                       x: 691.2835000002283,
  //                       y: -29.71650000022829,
  //                     },
  //                   },
  //                   x: 679.2835,
  //                   y: -17.716499999999996,
  //                 },
  //               },
  //               objectCaching: true,
  //               opacity: 1,
  //               originX: 'left',
  //               originY: 'top',
  //               padding: 0,
  //               paintFirst: 'fill',
  //               scaleX: 1,
  //               scaleY: 1,
  //               selectable: true,
  //               shadow: null,
  //               skewX: 0,
  //               skewY: 0,
  //               src: 'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Background.png?w=1394',
  //               stroke: null,
  //               strokeDashArray: null,
  //               strokeDashOffset: 0,
  //               strokeLineCap: 'butt',
  //               strokeLineJoin: 'miter',
  //               strokeMiterLimit: 4,
  //               strokeUniform: false,
  //               strokeWidth: 0,
  //               top: 0,
  //               type: 'image',
  //               version: '5.2.1',
  //               visible: true,
  //               width: 1394,
  //             },
  //             hoverCursor: 'move',
  //             objects: [],
  //             selectionColor: 'rgba(100, 100, 255, 0.3)',
  //             version: '5.2.1',
  //           },
  //           Dimensions: {
  //             Height: 2114,
  //             Width: 1394,
  //           },
  //           EditableAreas: [],
  //           FaceId: 3,
  //           FrameUrl: '',
  //           IsEditable: false,
  //           OverlayBackgroundUrl: '',
  //           PhotoZones: [],
  //           PreviewUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Preview.png',
  //           ReplaceBackgroundUrl: '',
  //           Texts: [],
  //           Type: 'back',
  //           UserImages: null,
  //           UserTextZones: [],
  //         },
  //       ],
  //       Name: 'PGM1207',
  //       OpenOrientation: 'right',
  //       ParentDimensions: {
  //         Height: 179,
  //         Width: 125,
  //       },
  //     },
  //   },
  // };

  const initialProjectData = {
    project_id: '7e9d85ca-3c12-420b-9e3e-ff08a0980c03',
    account_id: '2125445574',
    name: 'POD Project',
    product_id: '2PGM1207',
    scan_code: '0002391359',
    version: 1,
    is_digital_fulfillment: false,
    expiration_date: '2023-04-05T13:49:19.013821013Z',
    project_type_code: 'P',
    project_status_code: 'C',
    created_at: '2023-03-29T13:49:19.013847831Z',
    last_updated_at: '2023-03-29T13:49:19.013848884Z',
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
        CardFormat: 'portrait',
        CardSize: '49',
        CardType: 'photo',
        Dimensions: {
          Height: 179,
          Width: 125,
        },
        Faces: [
          {
            BackgroundUrl:
              'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Background.png',
            CanvasJson: null,
            Dimensions: {
              Height: 2114,
              Width: 1476,
            },
            EditableAreas: [],
            FaceId: 1,
            FrameUrl:
              'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Frame.png',
            IsEditable: true,
            OverlayBackgroundUrl: '',
            PhotoZones: [
              {
                Height: 1951.7098,
                LeftPosition: 21.259802,
                Rotation: 0,
                TopPosition: 45.70975,
                Width: 1363.6118,
              },
            ],
            PreviewUrl:
              'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P1_Preview.png',
            ReplaceBackgroundUrl: '',
            Texts: [
              {
                FontFamily: 'OMG Hi',
                FontId: 120,
                FontSize: 26,
                Height: 184.72404,
                IsFixed: true,
                IsHybrid: false,
                IsMultiline: false,
                LeftPosition: 170.5662,
                Rotation: 0,
                Text: 'RYLEIGH',
                TextAlign: 'center',
                TextColor: '#FFFFFF',
                TopPosition: 1693.4612,
                Width: 1063.9987,
              },
            ],
            Type: 'front',
            UserImages: null,
            UserTextZones: [],
          },
          {
            BackgroundUrl:
              'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Background.png',
            CanvasJson: null,
            Dimensions: {
              Height: 2114,
              Width: 2870,
            },
            EditableAreas: [],
            FaceId: 2,
            FrameUrl: '',
            IsEditable: true,
            OverlayBackgroundUrl: '',
            PhotoZones: [],
            PreviewUrl:
              'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P2-3_Preview.png',
            ReplaceBackgroundUrl: '',
            Texts: [],
            Type: 'inside',
            UserImages: null,
            UserTextZones: [],
          },
          {
            BackgroundUrl:
              'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Background.png',
            CanvasJson: null,
            Dimensions: {
              Height: 2114,
              Width: 1394,
            },
            EditableAreas: [],
            FaceId: 3,
            FrameUrl: '',
            IsEditable: false,
            OverlayBackgroundUrl: '',
            PhotoZones: [],
            PreviewUrl:
              'https://content.dev.hallmark.com/webassets/PGM1207/PGM1207_P4_Preview.png',
            ReplaceBackgroundUrl: '',
            Texts: [],
            Type: 'back',
            UserImages: null,
            UserTextZones: [],
          },
        ],
        Name: 'PGM1207',
        OpenOrientation: 'right',
        ParentDimensions: {
          Height: 179,
          Width: 125,
        },
      },
    },
  };

  const generateCanvasJSONUtil = (function () {
    let projectObj = { personalization: [] };

    const helperStore = (function () {
      const piBy2 = Math.PI / 2;
      const piBy180 = Math.PI / 180;
      const defaultUserDefinedImageWidth = 200;
      return {
        defaultUserDefinedImageWidth: defaultUserDefinedImageWidth,
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
      };
    })();

    function cleanUp() {
      projectObj = { personalization: [] };
    }

    function initializeProject(initialData) {
      if (
        initialData &&
        initialData.variables &&
        initialData.variables.template_data &&
        initialData.variables.template_data.Faces &&
        Array.isArray(initialData.variables.template_data.Faces)
      ) {
        Object.assign(projectObj, {
          project_id: initialData.project_id,
          account_id: initialData.account_id,
          name: initialData.name,
          product_id: initialData.product_id,
          scan_code: initialData.scan_code,
          version: initialData.version,
          is_digital_fulfillment: initialData.is_digital_fulfillment,
          expiration_date: initialData.expiration_date,
          project_type_code: initialData.project_type_code,
          project_status_code: initialData.project_status_code,
          created_at: initialData.created_at,
        });
        initialData.variables.template_data.Faces.forEach((face, faceindex) => {
          const personalizedFace = {
            FaceId: face.FaceId,
            FaceNumber: face.FaceId,
            CanvasJson: {
              version: '5.2.1',
              objects: [],
            },
            UserImages: [],
            canvasDimensions: face.Dimensions,
          };
          if (face.BackgroundUrl) {
            personalizedFace.CanvasJson.backgroundImage = {
              type: 'image',
              version: '5.2.1',
              originX: 'left',
              originY: 'top',
              left: 0,
              top: 0,
              width: face.Dimensions.Width,
              height: face.Dimensions.Height,
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
              src: face.BackgroundUrl,
              crossOrigin: 'anonymous',
              filters: [],
            };
          }
          if (face.PhotoZones && Array.isArray(face.PhotoZones)) {
            face.PhotoZones.forEach((photoZone, photoZoneIndex) => {
              const photoRect = {
                type: 'rect',
                version: '5.2.1',
                originX: 'left',
                originY: 'top',
                left: photoZone.LeftPosition,
                top: photoZone.TopPosition,
                width: photoZone.Width,
                height: photoZone.Height,
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
                angle: photoZone.Rotation || 0,
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
                name: `photozone-${photoZoneIndex}`,
              };
              personalizedFace.CanvasJson.objects.push(photoRect);
            });
          }
          if (face.FrameUrl) {
            const frameImageObj = {
              type: 'image',
              version: '5.2.1',
              originX: 'left',
              originY: 'top',
              left: 0,
              top: 0,
              width: face.Dimensions.Width,
              height: face.Dimensions.Height,
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
              src: face.FrameUrl,
              crossOrigin: 'anonymous',
              filters: [],
            };
            personalizedFace.CanvasJson.objects.push(frameImageObj);
          }
          if (face.Texts && Array.isArray(face.Texts)) {
            face.Texts.forEach((text, textIndex) => {
              const textObj = {
                type: 'textbox',
                version: '5.2.1',
                originX: 'left',
                originY: 'top',
                left: text.LeftPosition,
                top: text.TopPosition,
                width: text.Width,
                height: text.Height,
                fill: text.TextColor,
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
                fontFamily: `fontid-${text.FontId}`,
                fontWeight: 'normal',
                fontSize: text.FontSize * 4,
                text: text.Text,
                underline: false,
                overline: false,
                linethrough: false,
                textAlign: text.TextAlign,
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
                name: `userTextbox-${face.FaceId}-${textIndex}`,
              };
              personalizedFace.CanvasJson.objects.push(textObj);
            });
          }
          projectObj.personalization.push(personalizedFace);
        });
      }
    }

    function getProjectData() {
      return projectObj;
    }

    /**
     * function addImage
     */
    function addImage(
      imageConfig = {
        faceId: 1, //1,2,3
        photoZoneId: -1, //0,1,2
        userDefined: false,
        objectId: null, //imageId
        config: {}, //width,height,angle,insideWidth,multiplierX,multiplierY
      }
    ) {
      console.log('config from app', imageConfig);
      if (imageConfig.objectId == null) {
        return null;
      }
      const faceObj = projectObj.personalization[imageConfig.faceId - 1];
      const canvasjson = faceObj.CanvasJson;
      faceObj.UserImages.push(imageConfig.objectId);
      const imageWidth = imageConfig.config.width,
        imageHeight = imageConfig.config.height;
      if (imageConfig.photoZoneId !== -1 && imageConfig.userDefined === false) {
        const rectIndex = canvasjson.objects.findIndex(
          (obj) => obj.name === `photozone-${imageConfig.photoZoneId}`
        );
        if (rectIndex !== -1) {
          const photoZoneRect = canvasjson.objects[rectIndex];
          const photoZoneWidth = photoZoneRect.width,
            photoZoneHeight = photoZoneRect.height,
            photoZoneAngle = photoZoneRect.angle || 0;
          let scaleX = 1,
            scaleY = 1,
            left = photoZoneRect.left,
            top = photoZoneRect.top;
          if (imageWidth * scaleX > imageHeight * scaleY) {
            scaleX = scaleY = photoZoneHeight / (imageHeight * scaleY);
          }
          if (imageWidth * scaleX < imageHeight * scaleY) {
            scaleX = scaleY = photoZoneWidth / (imageWidth * scaleX);
          }
          if (imageWidth * scaleX < photoZoneWidth) {
            scaleX = scaleY = photoZoneWidth / (imageWidth * scaleX);
          }
          if (imageHeight * scaleY < photoZoneHeight) {
            scaleX = scaleY = photoZoneHeight / (imageHeight * scaleY);
          }
          if (imageWidth * scaleX > photoZoneWidth) {
            left = left - (imageWidth * scaleX - photoZoneWidth) / 2;
            top = top - (imageHeight * scaleY - photoZoneHeight) / 2;
          } else {
            top = top - (imageHeight * scaleY - photoZoneHeight) / 2;
            left = left - (imageWidth * scaleX - photoZoneWidth) / 2;
          }
          const imageObj = {
            type: 'image',
            version: '5.2.1',
            originX: 'left',
            originY: 'top',
            left: left,
            top: top,
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
            angle: photoZoneAngle,
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
              left: photoZoneRect.left,
              top: photoZoneRect.top,
              width: photoZoneRect.width,
              height: photoZoneRect.height,
              fill: 'rgb(0,0,0)',
              stroke: null,
              strokeWidth: 1,
              strokeDashArray: null,
              strokeLineCap: 'butt',
              strokeDashOffset: 0,
              strokeLineJoin: 'miter',
              strokeUniform: false,
              strokeMiterLimit: 4,
              scaleX: photoZoneRect.scaleX,
              scaleY: photoZoneRect.scaleY,
              angle: photoZoneRect.angle,
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
            name: `${photoZoneRect.name}-${imageConfig.objectId}`,
            src: imageConfig.config.uri,
            crossOrigin: 'anonymous',
            filters: [],
            userDefined: false,
          };
          canvasjson.objects.splice(rectIndex + 1, 0, imageObj);
          if (imageObj.angle) {
            this.applyRotation({
              faceId: imageConfig.faceId,
              type: 'image',
              objectName: imageObj.name,
              angle: helperStore.degreesToRadians(imageObj.angle),
            });
          }
          return imageObj.name;
        } else {
          return null;
        }
      }
      if (imageConfig.userDefined) {
        console.log('faceObj', faceObj);
        const canvasWidth = faceObj.canvasDimensions.Width || 0,
          canvasHeight = faceObj.canvasDimensions.Height || 0;
        let scaleX = 1,
          scaleY = 1,
          left = 0,
          top = 0;
        console.log('helperstore', helperStore);
        scaleX = scaleY =
          (helperStore.defaultUserDefinedImageWidth / imageWidth) *
          (1 / imageConfig.config.multiplierX);
        left =
          (imageConfig.config.insideWidth || 0) +
          (canvasWidth / 2 - imageWidth * scaleX) / 2;
        top = (canvasHeight - imageHeight * scaleY) / 2;
        const imageObj = {
          type: 'image',
          version: '5.2.1',
          originX: 'left',
          originY: 'top',
          left: left,
          top: top,
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
          angle: imageConfig.config.angle || 0,
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
          name: `userImage-${imageConfig.faceId}-${imageConfig.objectId}`,
          src: imageConfig.config.uri,
          crossOrigin: 'anonymous',
          filters: [],
          userDefined: true,
        };
        canvasjson.objects.push(imageObj);
        if (imageObj.angle) {
          this.applyRotation({
            faceId: imageConfig.faceId,
            type: 'image',
            objectName: imageObj.name,
            angle: helperStore.degreesToRadians(imageObj.angle),
          });
        }
        return imageObj.name;
      }
      return null;
    }

    function addText(
      textConfig = {
        faceId: 1,
        photoZoneId: -1,
        userDefined: true,
        objectId: null,
        config: {},
      }
    ) {
      if (textConfig.objectId == null) {
        return null;
      }
      const faceObj = projectObj.personalization[textConfig.faceId - 1];
      const canvasjson = faceObj.CanvasJson;
      let left = textConfig.config.left,
        top = textConfig.config.top,
        width = textConfig.config.width,
        height = textConfig.config.height,
        angle = textConfig.config.angle || 0;
      if (angle) {
      }
      const textObj = {
        type: 'textbox',
        version: '5.2.1',
        originX: 'left',
        originY: 'top',
        left: left,
        top: top,
        width: width,
        height: height,
        fill: textConfig.config.textColor,
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
        angle: angle,
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
        fontFamily: `fontid-${textConfig.config.fontId}`,
        fontWeight: 'normal',
        fontSize: textConfig.config.fontSize * 4,
        text: textConfig.config.text,
        underline: false,
        overline: false,
        linethrough: false,
        textAlign: textConfig.config.textAlign,
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
        name: `userTextbox-${faceObj.FaceId}-${textConfig.objectId}`,
        userDefined: true,
      };
      canvasjson.objects.push(textObj);
      if (imageObj.angle) {
        this.applyRotation({
          faceId: imageConfig.faceId,
          type: 'text',
          objectName: textObj.name,
          angle: helperStore.degreesToRadians(textObj.angle),
        });
      }
      return textObj.name;
    }

    function applyRotation(
      config = { faceId: 1, type: '', objectName: null, objectIndex: -1, angle }
    ) {
      if (
        config.objectName === null &&
        config.objectIndex === -1 &&
        config.type === ''
      ) {
        return false;
      }
      const faceObj = projectObj.personalization[config.faceId - 1];
      const canvasjson = faceObj.CanvasJson;
      let activeObj = null;
      if (config.objectName) {
        activeObj = canvasjson.objects.find(
          (obj) => obj.name === config.objectName
        );
      } else if (config.objectIndex !== -1 && config.type == 'text') {
        activeObj = canvasjson.objects.find(
          (obj) =>
            obj.name === `userTextbox-${faceObj.FaceId}-${config.objectIndex}`
        );
      }
      if (activeObj) {
        const rotatePoint = helperStore.rotatePoint(
          {
            x: activeObj.left,
            y: activeObj.top,
          },
          {
            x: activeObj.left + (activeObj.width * activeObj.scaleX) / 2,
            y: activeObj.top + (activeObj.height * activeObj.scaleY) / 2,
          },
          config.angle
        );
        activeObj.left = rotatePoint.x;
        activeObj.top = rotatePoint.y;
        activeObj.angle = helperStore.radToDegree(config.angle);
        return true;
      } else {
        return false;
      }
    }

    function applyScale(
      config = {
        faceId: 1,
        type: '',
        objectName: null,
        objectIndex: -1,
        scaleX: 1,
        scaleY: 1,
      }
    ) {
      if (
        config.objectName === null &&
        config.objectIndex === -1 &&
        config.type === ''
      ) {
        return false;
      }
      const faceObj = projectObj.personalization[config.faceId - 1];
      const canvasjson = faceObj.CanvasJson;
      let activeObj = null;
      if (config.objectName) {
        activeObj = canvasjson.objects.find(
          (obj) => obj.name === config.objectName
        );
      } else if (config.objectIndex !== -1 && config.type == 'text') {
        activeObj = canvasjson.objects.find(
          (obj) =>
            obj.name === `userTextbox-${faceObj.FaceId}-${config.objectIndex}`
        );
      }
      if (activeObj) {
        if (activeObj.type !== 'textbox') {
          console.log('config Obj in scale', config);
          if (activeObj.isPannedByUser) {
            activeObj.scaleX *= config.scaleX || 1;
            activeObj.scaleY *= config.scaleY || 1;
          } else {
            const newScaleX = activeObj.scaleX * (config.scaleX || 1);
            const newScaleY = activeObj.scaleY * (config.scaleY || 1);
            const centerPoint = {
              x: activeObj.left + (activeObj.width * activeObj.scaleX) / 2,
              y: activeObj.top + (activeObj.height * activeObj.scaleY) / 2,
            };
            const newCenterPoint = {
              x: activeObj.left + (activeObj.width * newScaleX) / 2,
              y: activeObj.top + (activeObj.height * newScaleY) / 2,
            };
            activeObj.left -= newCenterPoint.x - centerPoint.x;
            activeObj.top -= newCenterPoint.y - centerPoint.y;
            activeObj.scaleX = newScaleX;
            activeObj.scaleY = newScaleY;
          }
        } else {
          activeObj.scaleX *= config.scaleX || 1;
          activeObj.scaleY *= config.scaleY || 1;
        }
        return true;
      } else {
        return false;
      }
    }

    function applyPan(
      config = {
        faceId: 1,
        type: '',
        objectName: null,
        objectIndex: -1,
        translateX: 0,
        translateY: 0,
        multiplierX: 1,
        multiplierY: 1,
      }
    ) {
      if (
        config.objectName === null &&
        config.objectIndex === -1 &&
        config.type === ''
      ) {
        return false;
      }
      const faceObj = projectObj.personalization[config.faceId - 1];
      const canvasjson = faceObj.CanvasJson;
      let activeObj = null;
      if (config.objectName) {
        activeObj = canvasjson.objects.find(
          (obj) => obj.name === config.objectName
        );
      } else if (config.objectIndex !== -1 && config.type == 'text') {
        activeObj = canvasjson.objects.find(
          (obj) =>
            obj.name === `userTextbox-${faceObj.FaceId}-${config.objectIndex}`
        );
      }
      if (activeObj) {
        activeObj.left += config.translateX / config.multiplierX;
        activeObj.top += config.translateY / config.multiplierY;
        activeObj.isPannedByUser = true;
        return true;
      } else {
        return false;
      }
    }

    function updateTextProperties(
      config = {
        faceId: 1,
        type: '',
        objectName: null,
        objectIndex: -1,
        updateObj: {
          textColor: null,
          fontId: null,
          fontSize: null,
          text: null,
          textAlign: null,
        },
      }
    ) {
      if (
        config.objectName === null &&
        config.objectIndex === -1 &&
        config.type !== 'text'
      ) {
        return false;
      }
      const faceObj = projectObj.personalization[config.faceId - 1];
      const canvasjson = faceObj.CanvasJson;
      let activeObj = null;
      if (config.objectName) {
        activeObj = canvasjson.objects.find(
          (obj) => obj.name === config.objectName
        );
      } else if (config.objectIndex !== -1 && config.type == 'text') {
        activeObj = canvasjson.objects.find(
          (obj) =>
            obj.name === `userTextbox-${faceObj.FaceId}-${config.objectIndex}`
        );
      }
      if (activeObj) {
        const updates = {};
        for (const [key, value] of Object.entries(config.updateObj)) {
          console.log(`${key}: ${value}`);
          if (value) {
            switch (key) {
              case 'textColor':
                updates.fill = value;
                break;
              case 'fontId':
                updates.fontFamily = `fontid-${value}`;
                break;
              case 'fontSize':
                updates.fontSize = value * 4;
                break;
              case 'text':
                updates.text = value;
                break;
              case 'textAlign':
                updates.textAlign = value;
              default:
                console.log(`Sorry, no matchin property found to update.`);
                break;
            }
          }
        }
        Object.assign(activeObj, updates);
        return true;
      } else {
        return false;
      }
    }

    return {
      initializeProject,
      getProjectData,
      addImage,
      addText,
      applyPan,
      applyScale,
      applyRotation,
      cleanUp,
      updateTextProperties,
    };
  })();

  generateCanvasJSONUtil.initializeProject(initialProjectData);
  const imageNameFace1PhotoZone0 = generateCanvasJSONUtil.addImage({
    faceId: 1,
    photoZoneId: 0,
    objectId: '3732c7ea-ce72-4eb0-be84-fc186a307ae7',
    userDefined: false,
    config: {
      height: 4032,
      width: 3024,
      filename: 'IMG_4072.JPG',
      extension: 'jpg',
      fileSize: 1744579,
      uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/38c7d840-8f56-40e3-a70b-01f7fead1c398466342204829421918.JPG',
      type: 'image',
    },
  });
  const imageNameFace2 = generateCanvasJSONUtil.addImage({
    faceId: 2,
    userDefined: true,
    objectId: 'c169afff-9096-47ad-bdd9-c0b9b2b17fd2',
    config: {
      uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/a81970e4-514c-442b-8f58-87b5ea809f501873028403530748053.JPG',
      width: 3024,
      height: 4032,
      multiplierX: 0.2203,
    },
  });
  const opStatus1 = generateCanvasJSONUtil.applyRotation({
    faceId: 2,
    type: 'image',
    objectName: imageNameFace2,
    angle: configStore.degreesToRadians(45),
  });
  const opTextUpdateStatus = generateCanvasJSONUtil.updateTextProperties({
    faceId: 1,
    type: 'text',
    objectIndex: 0,
    updateObj: {
      text: 'Shrikant',
    },
  });
  const finalProjectData = generateCanvasJSONUtil.getProjectData();

  finalProjectData.personalization.forEach((finalJson, index) => {
    if (index == 0) {
      const fcanvas = new fabric.Canvas(document.querySelector('#fCanvas'), {
        width: finalJson.canvasDimensions.Width,
        height: finalJson.canvasDimensions.Height,
      });
      console.log(finalJson);
      fcanvas.loadFromJSON(finalJson.CanvasJson, () => {
        console.log(fcanvas);
        fcanvas.renderAll.bind(fcanvas);
      });
    }
    if (index == 1) {
      const icanvasEle = document.querySelector('#iCanvas');
      const icanvas = new fabric.Canvas(icanvasEle, {
        width: finalJson.canvasDimensions.Width,
        height: finalJson.canvasDimensions.Height,
      });
      console.log(finalJson);
      icanvas.loadFromJSON(finalJson.CanvasJson, () => {
        console.log(icanvas);
        icanvas.renderAll.bind(icanvas);
        if (!icanvasEle.parentElement.querySelector('.divider')) {
          const ele = document.createElement('div');
          ele.setAttribute('class', 'divider');
          icanvasEle.parentElement.appendChild(ele);
        }
      });
    }
    if (index == 2) {
      const bcanvas = new fabric.Canvas(document.querySelector('#bCanvas'), {
        width: finalJson.canvasDimensions.Width,
        height: finalJson.canvasDimensions.Height,
      });
      console.log(finalJson);
      bcanvas.loadFromJSON(finalJson.CanvasJson, () => {
        console.log(bcanvas);
        bcanvas.renderAll.bind(bcanvas);
      });
    }
  });
})();
