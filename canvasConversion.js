export const generateCanvasJSONUtil = (function () {
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
        angle: 0,
        multiplierX: 1,
      },
      imageConfig.config
    );
    if (!imageConfig.objectId) {
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
        // debugger;
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
          data: { scaleX, scaleY, centerPoint },
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
      const centerPoint = {
        x: left + (imageWidth * scaleX) / 2,
        y: top + (imageHeight * scaleY) / 2,
      };
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
        data: { scaleX, scaleY, centerPoint },
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
        angle: 0,
        textColor: '#000',
        fontId: 107,
        fontSize: 26,
        text: 'Edit this text',
        textAlign: 'center',
      },
      textConfig.config
    );
    if (!textConfig.objectId) {
      return null;
    }
    const faceObj = projectObj.personalization[textConfig.faceId - 1];
    const canvasjson = faceObj.CanvasJson;
    let left = textConfig.config.left,
      top = textConfig.config.top,
      width = textConfig.config.width,
      height = textConfig.config.height,
      angle = textConfig.config.angle || 0,
      scaleX = 1,
      scaleY = 1;
    const centerPoint = {
      x: left + (width * scaleX) / 2,
      y: top + (height * scaleY) / 2,
    };
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
      data: { scaleX, scaleY, centerPoint },
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
    config = Object.assign(
      { faceId: 1, type: '', objectName: null, objectIndex: -1, angle: null },
      config
    );
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
        config.angle || helperStore.degreesToRadians(activeObj.angle)
      );
      activeObj.left = rotatePoint.x;
      activeObj.top = rotatePoint.y;
      activeObj.angle = helperStore.radToDegree(config.angle);
      activeObj.data.centerPoint = {
        x: rotatePoint.x + (activeObj.width * activeObj.scaleX) / 2,
        y: rotatePoint.y + (activeObj.height * activeObj.scaleY) / 2,
      };
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
      console.log('config Obj in scale', config);
      if (activeObj.type !== 'textbox') {
        if (activeObj.isPannedByUser) {
          activeObj.scaleX = activeObj.data.scaleX * (config.scaleX || 1);
          activeObj.scaleY = activeObj.data.scaleY * (config.scaleY || 1);
        } else {
          const newScaleX = activeObj.data.scaleX * (config.scaleX || 1);
          const newScaleY = activeObj.data.scaleY * (config.scaleY || 1);
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
        activeObj.scaleX = activeObj.data.scaleX * (config.scaleX || 1);
        activeObj.scaleY = activeObj.data.scaleY * (config.scaleY || 1);
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
      activeObj.left =
        activeObj.data.centerPoint.x +
        config.translateX / config.multiplierX -
        (activeObj.scaleX * activeObj.width) / 2;
      activeObj.top =
        activeObj.data.centerPoint.y +
        config.translateY / config.multiplierY -
        (activeObj.scaleY * activeObj.height) / 2;
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
