(function () {
  const generateCanvasJSONUtil = (function () {
    let projectObj = { personalization: [] };
    /**
     * Logger utility to show logs
     */
    const logger = {
      logLevel: {
        error: true,
        warn: false,
        debug: false,
      },
      prefix: 'GCJU-V1.1.0',
      format: function (level = 'info', calledFrom = '') {
        return `${new Date().toISOString()} - ${
          this.prefix
        } - ${level} - ${calledFrom}`;
      },
      debug: function (data) {
        if (!this.logLevel.debug) return;
        const calledFrom = getFncName();
        console.log(this.format('debug', calledFrom), data);
      },
      warn: function (data) {
        if (!this.logLevel.warn) return;
        const warn = console.warn || console.log;
        const calledFrom = getFncName();
        warn(this.format('warn', calledFrom), data);
      },
      error: function (data) {
        if (!this.logLevel.error) return;
        const error = console.error || console.log;
        const calledFrom = getFncName();
        error(this.format('error', calledFrom), data);
      },
    };

    /**
     * @private
     * Returns function name which is currently executing
     */
    function getFncName() {
      const stackLine = new Error().stack.split('\n')[3].trim();
      const fncName = stackLine.match(/at Object.([^ ]+)/)?.[1];
      console.log(fncName);
      return fncName;
    }

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
      };
    })();

    /**
     * Set log level as per user preference, used for debugging purpose
     *
     * @param {Object} [config] object to set level e.g. {error: true, warn: false, debug: true}
     */
    function setLogLevel(config) {
      Object.assign(logger.logLevel, {
        error: config['error'] || true,
        warn: config['warn'] || false,
        debug: config['debug'] || false,
      });
    }

    /**
     * Resets the state of Canvas Json Util
     */
    function cleanUp() {
      logger.debug('');
      try {
        projectObj = { personalization: [] };
      } catch (e) {
        logger.error(e);
      }
      logger.debug('Done');
    }

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

    /**
     * Create and Setup the default canvas json objects present in the template
     *
     * @param {Object} [initialData] object containing the initial template data. structure can be found at https://raw.githubusercontent.com/shrikant-patwari-concord/fabric_web_poc/main/initial.json
     *
     *
     */
    function initializeProject(initialData) {
      logger.debug(
        JSON.parse(JSON.stringify({ msg: 'initialData', initialData }))
      );
      if (
        initialData &&
        initialData.variables &&
        initialData.variables.template_data &&
        initialData.variables.template_data.Faces &&
        Array.isArray(initialData.variables.template_data.Faces)
      ) {
        this.cleanUp();
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
            CanvasDimensions: face.Dimensions,
            CardFormat: initialData.variables.template_data.CardFormat,
            CardSize: initialData.variables.template_data.CardSize,
            CardType: initialData.variables.template_data.CardType,
            Type: face.Type,
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
                left: photoZone.LeftPosition + 18,
                top: photoZone.TopPosition + 18,
                width: photoZone.Width + 18,
                height: photoZone.Height + 18,
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
                left: text.LeftPosition + 18,
                top: text.TopPosition + text.Height / 4 + 18,
                width: text.Width + 18,
                height: text.Height + 18,
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
                angle: text.Rotation || 0,
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
                padding: 5,
                minWidth: 20,
                splitByGrapheme: false,
                name: `userTextbox-${face.FaceId}-${textIndex}`,
              };
              personalizedFace.CanvasJson.objects.push(textObj);
            });
          }
          projectObj.personalization.push(personalizedFace);
        });
        logger.debug('Done');
      } else {
        logger.error('project not setup due to unmet conditions');
      }
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
      projectObj.personalization.forEach((face) => {
        face.PrintJson = deepCopy(face.CanvasJson);
        if (face.PrintJson.backgroundImage) {
          face.PrintJson.backgroundImage.visible = showBackgroundImage(
            face.CardType,
            face.Type
          );
        }
      });
    }

    /**
     * Return fabric canvas json object
     * @returns {Object} object containing project info with canvas json obj
     */
    function getProjectData() {
      logger.debug('');
      try {
        buildPrintJson();
        return JSON.parse(JSON.stringify(projectObj));
      } catch (e) {
        logger.error(e);
      }
    }

    /**
     * Checks whether requested face present and project is initialized
     * @returns {Boolean}
     */
    function isFaceAndCanvasPresent(faceId) {
      if (
        faceId &&
        projectObj.personalization.length &&
        projectObj.personalization[faceId - 1]
      ) {
        return true;
      }
      return false;
    }

    /**
     * Add Image object to given face
     * @param [imageConfig] object containing information related to image
     * @returns {String | Null} if add image successfull return object name of image
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
      logger.debug(
        JSON.parse(JSON.stringify({ msg: 'config', config: imageConfig }))
      );
      if (!isFaceAndCanvasPresent(imageConfig.faceId)) {
        logger.error('Requested face not present, Operation failed');
        return null;
      }
      imageConfig = Object.assign(
        {
          faceId: 1,
          photoZoneId: -1,
          userDefined: false,
          objectId: null,
        },
        imageConfig
      );
      imageConfig.config = Object.assign(
        {
          width: 0,
          height: 0,
          uri: null,
          insideWidth: 0,
          insideHeight: 0,
          angle: 0,
          multiplierX: 1,
        },
        imageConfig.config
      );
      logger.debug(
        JSON.parse(
          JSON.stringify({ msg: 'updated-config', config: imageConfig })
        )
      );
      if (!imageConfig.objectId) {
        logger.error('objectId is required, Operation failed');
        return null;
      }
      try {
        const faceObj = projectObj.personalization[imageConfig.faceId - 1];
        const canvasjson = faceObj.CanvasJson;
        faceObj.UserImages.push(imageConfig.objectId);
        const imageWidth = imageConfig.config.width,
          imageHeight = imageConfig.config.height;
        if (
          imageConfig.photoZoneId !== -1 &&
          imageConfig.userDefined === false
        ) {
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
            if (imageWidth * scaleX > photoZoneWidth) {
              left = left - (imageWidth * scaleX - photoZoneWidth) / 2;
              top = top - (imageHeight * scaleY - photoZoneHeight) / 2;
            } else {
              top = top - (imageHeight * scaleY - photoZoneHeight) / 2;
              left = left - (imageWidth * scaleX - photoZoneWidth) / 2;
            }
            const centerPoint = {
              x: left + (imageWidth * scaleX) / 2,
              y: top + (imageHeight * scaleY) / 2,
            };
            logger.debug(
              JSON.parse(
                JSON.stringify({
                  msg: 'inside photozone image section',
                  photoZoneInfo: {
                    photoZoneWidth,
                    photoZoneHeight,
                    scaleX,
                    scaleY,
                    left,
                    top,
                    centerPoint,
                  },
                })
              )
            );
            const imageObj = {
              type: 'image',
              version: '5.2.1',
              originX: 'left',
              originY: 'top',
              left: left + 18,
              top: top + 18,
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
              data: {
                scaleX,
                scaleY,
                centerPoint,
                currCenterPoint: { x: centerPoint.x, y: centerPoint.y },
              },
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
            logger.debug(imageObj.name);
            return imageObj.name;
          } else {
            logger.error(
              'No photozone rect found with provided details to add image'
            );
            return null;
          }
        }
        if (imageConfig.userDefined) {
          const canvasWidth = faceObj.CanvasDimensions.Width || 0,
            canvasHeight = faceObj.CanvasDimensions.Height || 0,
            CardWidthDivisionFactor =
              faceObj.CardFormat.toLowerCase() === 'portrait' ? 2 : 1,
            CardHeightDivisionFactor =
              faceObj.CardFormat.toLowerCase() === 'portrait' ? 1 : 2;
          let scaleX = 1,
            scaleY = 1,
            left = 0,
            top = 0;
          scaleX = scaleY =
            (helperStore.getDefaultUserDefinedImageWidth(faceObj.CardFormat) /
              imageWidth) *
            (1 / imageConfig.config.multiplierX);
          left =
            (imageConfig.config.insideWidth || 0) +
            (canvasWidth / CardWidthDivisionFactor - imageWidth * scaleX) / 2;
          top =
            (imageConfig.config.insideHeight || 0) +
            (canvasHeight / CardHeightDivisionFactor - imageHeight * scaleY) /
              2;
          const centerPoint = {
            x: left + (imageWidth * scaleX) / 2,
            y: top + (imageHeight * scaleY) / 2,
          };
          logger.debug(
            JSON.parse(
              JSON.stringify({
                msg: 'inside userdefined section',
                userDefinedImageInfo: {
                  canvasWidth,
                  canvasHeight,
                  scaleX,
                  scaleY,
                  left,
                  top,
                  centerPoint,
                },
              })
            )
          );
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
            data: {
              scaleX,
              scaleY,
              centerPoint,
              currCenterPoint: { x: centerPoint.x, y: centerPoint.y },
            },
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
          logger.debug(imageObj.name);
          return imageObj.name;
        }
      } catch (e) {
        logger.error(e);
      }
      return null;
    }

    /**
     * Add text object to given face
     * @param [textConfig] object containing information related to text obj
     * @returns {String | Null} if add text obj successfull return object name
     */
    function addText(
      textConfig = {
        faceId: 1,
        photoZoneId: -1,
        userDefined: true,
        objectId: null,
        config: {},
      }
    ) {
      logger.debug(
        JSON.parse(JSON.stringify({ msg: 'config', config: textConfig }))
      );
      if (!isFaceAndCanvasPresent(textConfig.faceId)) {
        logger.error('Requested face not present, Operation failed');
        return null;
      }
      textConfig = Object.assign(
        {
          faceId: 1,
          photoZoneId: -1,
          userDefined: true,
          objectId: null,
        },
        textConfig
      );
      textConfig.config = Object.assign(
        {
          left: 0,
          top: 0,
          width: 1000,
          height: 180,
          insideWidth: 0,
          insideHeight: 0,
          angle: 0,
          textColor: '#000',
          fontId: 107,
          fontSize: 26,
          text: 'Edit this text',
          textAlign: 'center',
        },
        textConfig.config
      );
      logger.debug(
        JSON.parse(
          JSON.stringify({ msg: 'updated-config', config: textConfig })
        )
      );
      if (!textConfig.objectId) {
        logger.error('objectId is required, Operation failed');
        return null;
      }
      try {
        const faceObj = projectObj.personalization[textConfig.faceId - 1];
        const canvasjson = faceObj.CanvasJson;
        let left =
            textConfig.config.left + (textConfig.config.insideWidth || 0),
          top = textConfig.config.top + (textConfig.config.insideHeight || 0),
          width = textConfig.config.width,
          height = textConfig.config.height,
          angle = textConfig.config.angle || 0,
          scaleX = 1,
          scaleY = 1;
        const centerPoint = {
          x: left + (width * scaleX) / 2,
          y: top + (height * scaleY) / 2,
        };
        logger.debug(
          JSON.parse(
            JSON.stringify({
              width,
              height,
              scaleX,
              scaleY,
              left,
              top,
              angle,
              centerPoint,
            })
          )
        );
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
          scaleX: scaleX,
          scaleY: scaleY,
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
          data: {
            scaleX,
            scaleY,
            centerPoint,
            currCenterPoint: { x: centerPoint.x, y: centerPoint.y },
          },
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
        logger.debug(textObj.name);
        return textObj.name;
      } catch (e) {
        logger.error(e);
      }
      return null;
    }

    /**
     * Apply rotation from 0 radian to object from current center point of object
     * @param [config] object containing information related about face to use, object identification and angle in radian
     * @returns {Boolean} action applied status true or false
     */
    function applyRotation(
      config = { faceId: 1, type: '', objectName: null, objectIndex: -1, angle }
    ) {
      logger.debug(JSON.parse(JSON.stringify({ msg: 'config', config })));
      if (!isFaceAndCanvasPresent(config.faceId)) {
        logger.error('Requested face not present, Operation failed');
        return false;
      }
      config = Object.assign(
        { faceId: 1, type: '', objectName: null, objectIndex: -1, angle: null },
        config
      );
      logger.debug(
        JSON.parse(JSON.stringify({ msg: 'updated-config', config }))
      );
      if (
        (!config.objectName && config.type !== 'text') ||
        config.type === ''
      ) {
        logger.error('required attributes are unavailble, operation failed');
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
        logger.debug(
          JSON.parse(
            JSON.stringify({
              prevLeftTop: {
                x: activeObj.left,
                y: activeObj.top,
              },
              centerPoint: activeObj.data.currCenterPoint,
            })
          )
        );

        const currentWH = {
          x: activeObj.width * activeObj.scaleX,
          y: activeObj.height * activeObj.scaleY,
        };

        const nonRotatedObjLeftTop = {
          x: activeObj.data.currCenterPoint.x - currentWH.x / 2,
          y: activeObj.data.currCenterPoint.y - currentWH.y / 2,
        };

        logger.debug(
          JSON.parse(
            JSON.stringify({
              msg: 'before rotate',
              originalScaleX: activeObj.data.scaleX,
              originalScaleY: activeObj.data.scaleY,
              scaleX: activeObj.scaleX,
              scaleY: activeObj.scaleY,
              centerPoint: activeObj.data.currCenterPoint,
              currentWH,
              nonRotatedObjLeftTop,
              objLeft: activeObj.left,
              objTop: activeObj.top,
              angle: activeObj.angle,
              newAngle: config.angle,
            })
          )
        );

        const rotatePoint = helperStore.rotatePoint(
          nonRotatedObjLeftTop,
          activeObj.data.currCenterPoint,
          config.angle || helperStore.degreesToRadians(activeObj.angle)
        );
        activeObj.left = rotatePoint.x;
        activeObj.top = rotatePoint.y;
        activeObj.angle = helperStore.radToDegree(config.angle);

        logger.debug(
          JSON.parse(
            JSON.stringify({
              msg: 'after obj rotation',
              left: activeObj.left,
              top: activeObj.top,
            })
          )
        );

        return true;
      } else {
        logger.error('No object found with provided details');
        return false;
      }
    }

    /**
     * Apply scale to object from current center point of object
     * @param [config] object containing information related about face to use, object identification and new scaleX, ScaleY.
     * @returns {Boolean} action applied status true or false
     */
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
      logger.debug(JSON.parse(JSON.stringify({ msg: 'config', config })));
      if (!isFaceAndCanvasPresent(config.faceId)) {
        logger.error('Requested face not present, Operation failed');
        return false;
      }
      config = Object.assign(
        {
          faceId: 1,
          type: '',
          objectName: null,
          objectIndex: -1,
          scaleX: 1,
          scaleY: 1,
        },
        config
      );
      logger.debug(
        JSON.parse(JSON.stringify({ msg: 'updated-config', config }))
      );
      if (
        (!config.objectName && config.type !== 'text') ||
        config.type === ''
      ) {
        logger.error('required attributes are unavailble, operation failed');
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
        logger.debug(
          JSON.parse(
            JSON.stringify({ msg: 'found active obj', type: activeObj.type })
          )
        );
        const newScaleX = activeObj.data.scaleX * (config.scaleX || 1);
        const newScaleY = activeObj.data.scaleY * (config.scaleY || 1);

        const updatedWH = {
          x: activeObj.width * newScaleX,
          y: activeObj.height * newScaleY,
        };
        logger.debug(
          JSON.parse(
            JSON.stringify({
              msg: 'before scale',
              originalScaleX: activeObj.data.scaleX,
              originalScaleY: activeObj.data.scaleY,
              newScaleX,
              newScaleY,
              oldScaleX: activeObj.scaleX,
              oldScaleY: activeObj.scaleY,
              centerPoint: activeObj.data.currCenterPoint,
              updatedWH,
              oldWH: {
                x: activeObj.width * activeObj.scaleX,
                y: activeObj.height * activeObj.scaleY,
              },
              oldObjLeft: activeObj.left,
              oldObjTop: activeObj.top,
            })
          )
        );
        activeObj.left = activeObj.data.currCenterPoint.x - updatedWH.x / 2;
        activeObj.top = activeObj.data.currCenterPoint.y - updatedWH.y / 2;
        // activeObj.left += 18;
        // activeObj.top += 18;
        logger.debug(
          JSON.parse(
            JSON.stringify({
              msg: 'after scale unrotated obj',
              newObjLeft: activeObj.left,
              newObjTop: activeObj.top,
            })
          )
        );
        activeObj.scaleX = newScaleX;
        activeObj.scaleY = newScaleY;
        if (activeObj.angle) {
          const rotatePoint = helperStore.rotatePoint(
            {
              x: activeObj.left,
              y: activeObj.top,
            },
            activeObj.data.currCenterPoint,
            helperStore.degreesToRadians(activeObj.angle)
          );
          activeObj.left = rotatePoint.x;
          activeObj.top = rotatePoint.y;
          logger.debug(
            JSON.parse(
              JSON.stringify({
                msg: 'after scale and rotate obj',
                newObjLeft: activeObj.left,
                newObjTop: activeObj.top,
              })
            )
          );
        }
        return true;
      } else {
        logger.error('No object found with provided details');
        return false;
      }
    }

    /**
     * Apply pan to object from canvas center point
     * @param [config] object containing information related about face to use, object identification, multiplier factor and transalete distance.
     * @returns {Boolean} action applied status true or false
     */
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
      logger.debug(JSON.parse(JSON.stringify({ msg: 'config', config })));
      if (!isFaceAndCanvasPresent(config.faceId)) {
        logger.error('Requested face not present, Operation failed');
        return false;
      }
      config = Object.assign(
        {
          faceId: 1,
          type: '',
          objectName: null,
          objectIndex: -1,
          translateX: 0,
          translateY: 0,
          multiplierX: 1,
          multiplierY: 1,
        },
        config
      );
      logger.debug(
        JSON.parse(JSON.stringify({ msg: 'updated-config', config }))
      );
      if (
        (!config.objectName && config.type !== 'text') ||
        config.type === ''
      ) {
        logger.error('required attributes are unavailble, operation failed');
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
        logger.debug(
          JSON.parse(
            JSON.stringify({ msg: 'found active obj', type: activeObj.type })
          )
        );

        const translatedCenter = {
          x:
            activeObj.data.centerPoint.x +
            (config.translateX * (activeObj.scaleX / activeObj.data.scaleX)) /
              config.multiplierX,
          y:
            activeObj.data.centerPoint.y +
            (config.translateY * (activeObj.scaleY / activeObj.data.scaleY)) /
              config.multiplierY,
        };
        const objWidth = (activeObj.scaleX * activeObj.width) / 2;
        const objHeight = (activeObj.scaleY * activeObj.height) / 2;
        logger.debug(
          JSON.parse(
            JSON.stringify({
              msg: 'original top left',
              oldLeft: activeObj.left,
              oldTop: activeObj.top,
              newTop: translatedCenter.y - objHeight,
              newLeft: translatedCenter.x - objWidth,
              centerPoint: activeObj.data.centerPoint,
              translateX:
                (config.translateX *
                  (activeObj.scaleX / activeObj.data.scaleX)) /
                config.multiplierX,
              translateY:
                (config.translateY *
                  (activeObj.scaleY / activeObj.data.scaleY)) /
                config.multiplierY,
              translatedCenter,
              objWidth,
              objHeight,
            })
          )
        );
        activeObj.left = translatedCenter.x - objWidth;
        activeObj.top = translatedCenter.y - objHeight;
        activeObj.data.currCenterPoint = translatedCenter;
        if (activeObj.angle) {
          const rotatePoint = helperStore.rotatePoint(
            {
              x: activeObj.left,
              y: activeObj.top,
            },
            translatedCenter,
            helperStore.degreesToRadians(activeObj.angle)
          );
          activeObj.left = rotatePoint.x;
          activeObj.top = rotatePoint.y;
        }
        logger.debug(
          JSON.parse(
            JSON.stringify({
              msg: 'after update applied top left',
              newTopLeft: {
                left: activeObj.left,
                top: activeObj.top,
              },
            })
          )
        );
        return true;
      } else {
        logger.error('No object found with provided details');
        return false;
      }
    }

    /**
     * Apply updates to text object
     * @param [config] object containing information related about face to use, object identification and text properties.
     * @returns {Boolean} action applied status true or false
     */
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
      logger.debug(['config', JSON.stringify(config)]);
      if (!isFaceAndCanvasPresent(config.faceId)) {
        logger.error('Requested face not present, Operation failed');
        return false;
      }
      config = Object.assign(
        {
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
        },
        config
      );
      logger.debug(['updatedConfig', JSON.stringify(config)]);
      if (
        !config.objectName &&
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
        logger.debug(['updates to be applied', updates]);
        Object.assign(activeObj, updates);
        return true;
      } else {
        logger.error('No object found with provided details');
        return false;
      }
    }

    /**
     * Removes the object json from given face
     * @param [config] object containing information related about face to use, object identification.
     * @returns {Boolean} action applied status true or false
     */
    function deleteObj(
      config = {
        faceId: 1,
        type: '',
        objectName: null,
        objectIndex: -1,
      }
    ) {
      logger.debug(JSON.parse(JSON.stringify({ msg: 'config', config })));
      if (!isFaceAndCanvasPresent(config.faceId)) {
        logger.error('Requested face not present, Operation failed');
        return false;
      }
      config = Object.assign(
        {
          faceId: 1,
          type: '',
          objectName: null,
          objectIndex: -1,
        },
        config
      );
      if (
        (!config.objectName && config.type !== 'text') ||
        config.type === ''
      ) {
        logger.error('required attributes are unavailble, operation failed');
        return false;
      }
      const faceObj = projectObj.personalization[config.faceId - 1];
      const canvasjson = faceObj.CanvasJson;
      let activeObjIndex = -1;
      if (config.objectName) {
        activeObjIndex = canvasjson.objects.findIndex(
          (obj) => obj.name === config.objectName
        );
      } else if (config.objectIndex !== -1 && config.type == 'text') {
        activeObjIndex = canvasjson.objects.findIndex(
          (obj) =>
            obj.name === `userTextbox-${faceObj.FaceId}-${config.objectIndex}`
        );
      }
      if (activeObjIndex !== -1) {
        logger.debug(
          JSON.parse(
            JSON.stringify({
              msg: 'found active obj',
              type: canvasjson.objects[activeObjIndex].type,
            })
          )
        );
        canvasjson.objects.splice(activeObjIndex, 1);
        return true;
      } else {
        logger.error('No object found with provided details');
        return false;
      }
    }

    return {
      initializeProject,
      getProjectData,
      addImage,
      addText,
      applyPan,
      panDebounce: helperStore.debounce(applyPan, 500),
      applyScale,
      scaleDebounce: helperStore.debounce(applyScale, 500),
      applyRotation,
      rotateDebounce: helperStore.debounce(applyRotation, 500),
      cleanUp,
      setLogLevel,
      updateTextProperties,
      textDebounce: helperStore.debounce(updateTextProperties, 500),
      deleteObj,
    };
  })();

  const piBy180 = Math.PI / 180;
  const degreesToRadians = (deg) => {
    return (deg || 0) * piBy180;
  };

  // const initialProjectData = {
  //   project_id: 'd6eea687-879b-4d3f-8162-8cade0b365ee',
  //   account_id: '2125543278',
  //   name: 'POD Project',
  //   product_id: '2PGM1243',
  //   scan_code: '0002397727',
  //   version: 1,
  //   is_digital_fulfillment: false,
  //   expiration_date: '2023-05-04T10:30:44.585018807Z',
  //   project_type_code: 'P',
  //   project_status_code: 'C',
  //   created_at: '2023-04-27T10:30:44.585043145Z',
  //   last_updated_at: '2023-04-27T10:30:44.585044254Z',
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
  //     product_id: '2PGM1243',
  //     template_id: 'PGM1243',
  //     product_name: 'Personalized Create Your Own Photo Collage Photo Card',
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
  //             'https://content.dev.hallmark.com/webassets/PGM1243/PGM1243_P1_Background.png',
  //           CanvasJson: null,
  //           Dimensions: {
  //             Height: 2114,
  //             Width: 1476,
  //           },
  //           EditableAreas: [],
  //           FaceId: 1,
  //           FrameUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1243/PGM1243_P1_Frame.png',
  //           IsEditable: true,
  //           OverlayBackgroundUrl: '',
  //           PhotoZones: [
  //             {
  //               Height: 592.9984,
  //               LeftPosition: 707.5651,
  //               Rotation: 0,
  //               TopPosition: 798.5653,
  //               Width: 594.9992,
  //             },
  //             {
  //               Height: 592.9984,
  //               LeftPosition: 102.56673,
  //               Rotation: 0,
  //               TopPosition: 798.5653,
  //               Width: 596.99884,
  //             },
  //             {
  //               Height: 592.99963,
  //               LeftPosition: 707.5651,
  //               Rotation: 0,
  //               TopPosition: 197.56615,
  //               Width: 594.9992,
  //             },
  //             {
  //               Height: 592.99963,
  //               LeftPosition: 102.56673,
  //               Rotation: 0,
  //               TopPosition: 197.56615,
  //               Width: 596.99884,
  //             },
  //           ],
  //           PreviewUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1243/PGM1243_P1_Preview.png',
  //           ReplaceBackgroundUrl: '',
  //           Texts: [
  //             {
  //               FontFamily: 'Just a Note',
  //               FontId: 122,
  //               FontSize: 17,
  //               Height: 141.22295,
  //               IsFixed: true,
  //               IsHybrid: false,
  //               IsMultiline: false,
  //               LeftPosition: 113.56631,
  //               Rotation: 0,
  //               Text: 'H I .  H E L L O .',
  //               TextAlign: 'center',
  //               TextColor: '#3E3B3A',
  //               TopPosition: 1462.6306,
  //               Width: 1177.9984,
  //             },
  //           ],
  //           Type: 'front',
  //           UserImages: null,
  //           UserTextZones: [],
  //         },
  //         {
  //           BackgroundUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1243/PGM1243_P2-3_Background.png',
  //           CanvasJson: null,
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
  //             'https://content.dev.hallmark.com/webassets/PGM1243/PGM1243_P2-3_Preview.png',
  //           ReplaceBackgroundUrl: '',
  //           Texts: [],
  //           Type: 'inside',
  //           UserImages: null,
  //           UserTextZones: [],
  //         },
  //         {
  //           BackgroundUrl:
  //             'https://content.dev.hallmark.com/webassets/PGM1243/PGM1243_P4_Background.png',
  //           CanvasJson: null,
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
  //             'https://content.dev.hallmark.com/webassets/PGM1243/PGM1243_P4_Preview.png',
  //           ReplaceBackgroundUrl: '',
  //           Texts: [],
  //           Type: 'back',
  //           UserImages: null,
  //           UserTextZones: [],
  //         },
  //       ],
  //       Name: 'PGM1243',
  //       OpenOrientation: 'right',
  //       ParentDimensions: {
  //         Height: 179,
  //         Width: 125,
  //       },
  //     },
  //   },
  // };
  const initialProjectData = {
    project_id: '77267321-fd45-4622-9f7e-72f719afe273',
    account_id: '2125542841',
    name: 'POD Project',
    product_id: '2PGM1209',
    scan_code: '0002397650',
    version: 1,
    is_digital_fulfillment: false,
    expiration_date: '2023-05-04T07:38:45.890926809Z',
    project_type_code: 'P',
    project_status_code: 'C',
    created_at: '2023-04-27T07:38:45.890947359Z',
    last_updated_at: '2023-04-27T07:38:45.890948233Z',
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
      product_id: '2PGM1209',
      template_id: 'PGM1209',
      product_name: 'Personalized Celebration Confetti Birthday Photo Card',
      vendor_lead_time: 1,
      envelope_color: '#FFFFF',
    },
    fulfillment: {},
    variables: {
      template_data: {
        CardFormat: 'landscape',
        CardSize: '49',
        CardType: 'photo',
        Dimensions: {
          Height: 125,
          Width: 179,
        },
        Faces: [
          {
            BackgroundUrl:
              'https://content.dev.hallmark.com/webassets/PGM1209/PGM1209_P1_Background.png',
            CanvasJson: null,
            Dimensions: {
              Height: 1476,
              Width: 2114,
            },
            EditableAreas: [],
            FaceId: 1,
            FrameUrl:
              'https://content.dev.hallmark.com/webassets/PGM1209/PGM1209_P1_Frame.png',
            IsEditable: true,
            OverlayBackgroundUrl: '',
            PhotoZones: [
              {
                Height: 1476.9974,
                LeftPosition: 911.5647,
                Rotation: 0,
                TopPosition: -35.433,
                Width: 1166.9977,
              },
            ],
            PreviewUrl:
              'https://content.dev.hallmark.com/webassets/PGM1209/PGM1209_P1_Preview.png',
            ReplaceBackgroundUrl: '',
            Texts: [],
            Type: 'front',
            UserImages: null,
            UserTextZones: [],
          },
          {
            BackgroundUrl:
              'https://content.dev.hallmark.com/webassets/PGM1209/PGM1209_P2-3_Background.png',
            CanvasJson: null,
            Dimensions: {
              Height: 2870,
              Width: 2114,
            },
            EditableAreas: [],
            FaceId: 2,
            FrameUrl: '',
            IsEditable: true,
            OverlayBackgroundUrl: '',
            PhotoZones: [],
            PreviewUrl:
              'https://content.dev.hallmark.com/webassets/PGM1209/PGM1209_P2-3_Preview.png',
            ReplaceBackgroundUrl: '',
            Texts: [],
            Type: 'inside',
            UserImages: null,
            UserTextZones: [],
          },
          {
            BackgroundUrl:
              'https://content.dev.hallmark.com/webassets/PGM1209/PGM1209_P4_Background.png',
            CanvasJson: null,
            Dimensions: {
              Height: 1394,
              Width: 2114,
            },
            EditableAreas: [],
            FaceId: 3,
            FrameUrl: '',
            IsEditable: false,
            OverlayBackgroundUrl: '',
            PhotoZones: [],
            PreviewUrl:
              'https://content.dev.hallmark.com/webassets/PGM1209/PGM1209_P4_Preview.png',
            ReplaceBackgroundUrl: '',
            Texts: [],
            Type: 'back',
            UserImages: null,
            UserTextZones: [],
          },
        ],
        Name: 'PGM1209',
        OpenOrientation: 'down',
        ParentDimensions: {
          Height: 125,
          Width: 179,
        },
      },
    },
  };

  const loadFont = () => {
    const fontLoadPromises = [];
    initialProjectData.font_collection.fonts.forEach((font) => {
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
          // console.log(font_face_set);
          usecanvasJSONUtil();
        });
      })
      .catch((r) => {
        // console.log(r);
        document.fonts.ready.then(function (font_face_set) {
          // all fonts have been loaded
          // console.log(font_face_set);
          usecanvasJSONUtil();
        });
      });
  };

  function usecanvasJSONUtil() {
    generateCanvasJSONUtil.setLogLevel({
      debug: true,
      warn: true,
      error: true,
    });
    generateCanvasJSONUtil.initializeProject(initialProjectData);

    console.log(generateCanvasJSONUtil.getProjectData());
    const imageNameFace2 = generateCanvasJSONUtil.addImage({
      faceId: 2,
      photoZoneId: 0,
      userDefined: true,
      objectId: 'eca3bb28-6e05-47da-bdc1-6a62831fc753',
      config: {
        playableDuration: null,
        height: 543,
        width: 460,
        filename: 'IMG_4241.JPG',
        extension: 'png',
        fileSize: 2053949,
        uri: 'https://s3.us-west-2.amazonaws.com/hmklabs-dotcom-dev-us-west-2-consumer-images/images/48a49307-5c7a-4ef3-9b32-16237f6fa7c39158535993642250996.png',
        type: 'image',
        localUrl: 'ph://3134E70B-EFEE-48D3-A01B-5EFCAFD6B393/L0/001',
        multiplierX: 0.2269647696476965,
        multiplierY: 0.22682119205298013,
      },
    });

    // const opScale = generateCanvasJSONUtil.applyScale({
    //   faceId: 2,
    //   objectIndex: 0,
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   scaleX: undefined,
    //   scaleY: undefined,
    //   type: 'image',
    // });

    // const opPan = generateCanvasJSONUtil.applyPan({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   translateX: -35.5,
    //   translateY: -78,
    //   multiplierX: 0.22154471544715448,
    //   multiplierY: 0.22138126773888364,
    // });

    console.log(generateCanvasJSONUtil.getProjectData());
    // const opRotate1 = generateCanvasJSONUtil.applyRotation({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   angle: degreesToRadians(-31),
    // });

    // const opPan1 = generateCanvasJSONUtil.applyPan({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   translateX: 5.500000000000028,
    //   translateY: -47.5,
    //   multiplierX: 0.22154471544715448,
    //   multiplierY: 0.22138126773888364,
    // });

    // const opRotate2 = generateCanvasJSONUtil.applyRotation({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   angle: degreesToRadians(45),
    // });

    // const opPan2 = generateCanvasJSONUtil.applyPan({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   translateX: -35.5,
    //   translateY: 78,
    //   multiplierX: 0.22154471544715448,
    //   multiplierY: 0.22138126773888364,
    // });

    // const opScale1 = generateCanvasJSONUtil.applyScale({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   scaleX: 0.5,
    //   scaleY: 0.5,
    // });

    // console.log('debounce check');
    // for (let i = 1; i <= 90; i++) {
    //   console.log(
    //     generateCanvasJSONUtil.rotateDebounce({
    //       faceId: 2,
    //       type: 'image',
    //       objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //       objectIndex: 0,
    //       angle: degreesToRadians(i),
    //     })
    //   );
    // }

    // const opPan3 = generateCanvasJSONUtil.applyPan({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   translateX: 0,
    //   translateY: -39,
    //   multiplierX: 0.22154471544715448,
    //   multiplierY: 0.22138126773888364,
    // });

    // const opScale2 = generateCanvasJSONUtil.applyScale({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   scaleX: 1,
    //   scaleY: 0.5,
    // });

    // const opScale2 = generateCanvasJSONUtil.applyScale({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   scaleX: 0.49453978159126366,
    //   scaleY: 0.49453978159126366,
    // });

    // const opRotate3 = generateCanvasJSONUtil.applyRotation({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   angle: -0.8726646259971648,
    // });
    // const opScale3 = generateCanvasJSONUtil.applyScale({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   scaleX: 1.1653666146645867,
    //   scaleY: 1.1653666146645867,
    // });
    // const opPan = generateCanvasJSONUtil.applyPan({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   translateX: 53.49999999999997,
    //   translateY: -53.5,
    //   multiplierX: 0.22154471544715448,
    //   multiplierY: 0.22138126773888364,
    // });
    // const opRotate4 = generateCanvasJSONUtil.applyRotation({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   angle: -0.8726646259971648,
    // });

    // const opScale4 = generateCanvasJSONUtil.applyScale({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   scaleX: 0.6723868954758192,
    //   scaleY: 0.6723868954758192,
    // });

    // const opRotate5 = generateCanvasJSONUtil.applyRotation({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   angle: 1.3264502315156905,
    // });

    // const opScale5 = generateCanvasJSONUtil.applyScale({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   scaleX: 0.6723868954758192,
    //   scaleY: 0.6723868954758192,
    // });

    // const opPan1 = generateCanvasJSONUtil.applyPan({
    //   faceId: 2,
    //   type: 'image',
    //   objectName: 'userImage-2-eca3bb28-6e05-47da-bdc1-6a62831fc753',
    //   objectIndex: 0,
    //   translateX: -17.5,
    //   translateY: -136.5,
    //   multiplierX: 0.22154471544715448,
    //   multiplierY: 0.22138126773888364,
    // });

    const finalProjectData = generateCanvasJSONUtil.getProjectData();

    finalProjectData.personalization.forEach((finalJson, index) => {
      // if (index == 0) {
      //   const fcanvas = new fabric.Canvas(document.querySelector('#fCanvas'), {
      //     width: finalJson.CanvasDimensions.Width,
      //     height: finalJson.CanvasDimensions.Height,
      //   });
      //   // console.log(finalJson);
      //   fcanvas.loadFromJSON(finalJson.CanvasJson, () => {
      //     // console.log(fcanvas);
      //     fcanvas.renderAll.bind(fcanvas);
      //   });
      // }
      if (index == 1) {
        const icanvasEle = document.querySelector('#iCanvas');
        const icanvas = new fabric.Canvas(icanvasEle, {
          width: finalJson.CanvasDimensions.Width,
          height: finalJson.CanvasDimensions.Height,
        });
        console.log(finalJson);
        icanvas.loadFromJSON(finalJson.CanvasJson, () => {
          console.log(icanvas);
          icanvas.renderAll.bind(icanvas);
          if (
            finalJson.CardFormat === 'portrait' &&
            !icanvasEle.parentElement.querySelector('.dividerV')
          ) {
            const ele = document.createElement('div');
            ele.setAttribute('class', 'dividerV');
            icanvasEle.parentElement.appendChild(ele);
          }
          if (
            finalJson.CardFormat !== 'portrait' &&
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
      //     width: finalJson.CanvasDimensions.Width,
      //     height: finalJson.CanvasDimensions.Height,
      //   });
      //   // console.log(finalJson);
      //   bcanvas.loadFromJSON(finalJson.CanvasJson, () => {
      //     // console.log(bcanvas);
      //     bcanvas.renderAll.bind(bcanvas);
      //   });
      // }
    });
  }

  loadFont();
})();
