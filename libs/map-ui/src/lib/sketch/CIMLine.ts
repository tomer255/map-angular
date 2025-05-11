import Color from '@arcgis/core/Color';
import { CIMSymbol } from '@arcgis/core/symbols';

export const setLineColor = (symbol: CIMSymbol, color: Color) => {
  if (symbol.data.symbol?.type !== 'CIMLineSymbol') return;
  symbol.data.symbol.symbolLayers.forEach((symbolLayer) => {
    if (symbolLayer.type === 'CIMSolidStroke') {
      symbolLayer.color[0] = color.r;
      symbolLayer.color[1] = color.g;
      symbolLayer.color[2] = color.b;
    }
    if (symbolLayer.type === 'CIMPictureMarker' && symbolLayer.tintColor) {
      symbolLayer.tintColor[0] = color.r;
      symbolLayer.tintColor[1] = color.g;
      symbolLayer.tintColor[2] = color.b;
    }
  });
};

export type StrokeOption = {
  dualiy: 'single' | 'double';
  type: 'solid' | 'dashes' | 'dotted';
};

export const setLineStroke = (symbol: CIMSymbol, option: StrokeOption) => {
  if (symbol.data.symbol?.type != 'CIMLineSymbol') return;
  const solidStrokes = symbol.data.symbol.symbolLayers.filter(
    (layer) => layer.type === 'CIMSolidStroke'
  );
  for (const stroke of solidStrokes) {
    stroke.enable =
      (stroke.primitiveName === 'stroke-single') ===
      (option.dualiy == 'single');

    stroke.effects = stroke.effects?.filter(
      (effect) => effect.type != 'CIMGeometricEffectDashes'
    );
    const size = stroke.width;
    if (option.type === 'dashes')
      stroke.effects?.push({
        type: 'CIMGeometricEffectDashes',
        primitiveName: 'dashes',
        dashTemplate: [size, size + 1],
        lineDashEnding: 'FullGap',
        offsetAlongLine: 0,
      });
    if (option.type === 'dotted')
      stroke.effects?.push({
        type: 'CIMGeometricEffectDashes',
        primitiveName: 'dotted',
        dashTemplate: [1, size + 1],
        lineDashEnding: 'FullGap',
        offsetAlongLine: 0,
      });
  }
};

export const setLineSize = (symbol: CIMSymbol, size: number) => {
  if (symbol.data.symbol?.type != 'CIMLineSymbol') return;
  const solidStrokes = symbol.data.symbol.symbolLayers.filter(
    (layer) => layer.type === 'CIMSolidStroke'
  );
  for (const stroke of solidStrokes) {
    stroke.width = size;
    const dotted = stroke.effects?.find(
      (effect) => effect.primitiveName === 'dotted'
    );
    if (dotted)
      (dotted as __esri.CIMGeometricEffectDashes).dashTemplate = [1, size + 1];

    const dashes = stroke.effects?.find(
      (effect) => effect.primitiveName === 'dashes'
    );
    if (dashes)
      (dashes as __esri.CIMGeometricEffectDashes).dashTemplate = [
        size,
        size + 1,
      ];
  }
  const pictureMarker = symbol.data.symbol.symbolLayers.filter(
    (layer) => layer.type === 'CIMPictureMarker'
  );
  for (const marker of pictureMarker) {
    marker.size = 12 + size * 2;
  }
};

// const setLineIcon = (
//   symbol: CIMSymbol,
//   option: {
//     beginIconUrl: string | null;
//     endIconUrl: string | null;
//   }
// ) => {};

export const CIMLine = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    symbol: {
      type: 'CIMLineSymbol',
      symbolLayers: [
        {
          type: 'CIMSolidStroke',
          primitiveName: 'stroke-single',
          enable: true,
          width: 2,
          color: [0, 0, 0, 255],
          effects: [],
        },
        {
          type: 'CIMSolidStroke',
          primitiveName: 'stroke-double',
          enable: false,
          width: 2,
          color: [0, 0, 0, 255],
          effects: [
            {
              type: 'CIMGeometricEffectOffset',
              method: 'Rounded',
              offset: -4,
              option: 'Fast',
            },
          ],
        },
        {
          type: 'CIMSolidStroke',
          primitiveName: 'stroke-double',
          enable: false,
          width: 2,
          color: [0, 0, 0, 255],
          effects: [
            {
              type: 'CIMGeometricEffectOffset',
              method: 'Rounded',
              offset: 4,
              option: 'Fast',
            },
          ],
        },
        {
          type: 'CIMPictureMarker',
          primitiveName: 'endMarker',
          enable: true,
          effects: [],
          url: 'arrow/arrow-tips-open.svg',
          size: 12,
          tintColor: [0, 0, 0, 255],
          markerPlacement: {
            type: 'CIMMarkerPlacementAtExtremities',
            extremityPlacement: 'JustEnd',
          },
        },
        {
          primitiveName: 'BeginMarker',
          type: 'CIMPictureMarker',
          enable: true,
          effects: [],
          url: 'arrow/arrow-tips-circle.svg',
          size: 16,
          tintColor: [0, 0, 0, 255],
          markerPlacement: {
            type: 'CIMMarkerPlacementAtExtremities',
            extremityPlacement: 'JustBegin',
          },
        },
      ],
    },
  },
});
