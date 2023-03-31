(function () {

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
