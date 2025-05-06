import { CIMSymbol } from '@arcgis/core/symbols';

export const arrow = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    symbol: {
      type: 'CIMLineSymbol',
      symbolLayers: [
        {
          type: 'CIMSolidStroke',
          enable: true,
          width: 2,
          color: [0, 0, 0, 255],
          effects: [
            {
              type: 'CIMGeometricEffectOffset',
              method: 'Rounded',
              offset: -2,
              option: 'Fast',
            },
            {
              type: 'CIMGeometricEffectDashes',
              dashTemplate: [5, 5],
              lineDashEnding: 'FullGap',
              offsetAlongLine: 3,
            },
          ],
        },
        {
          type: 'CIMSolidStroke',
          enable: true,
          width: 2,
          color: [0, 0, 0, 255],
          effects: [
            {
              type: 'CIMGeometricEffectOffset',
              method: 'Rounded',
              offset: 2,
              option: 'Fast',
            },
            {
              type: 'CIMGeometricEffectDashes',
              dashTemplate: [5, 5],
              lineDashEnding: 'FullGap',
              offsetAlongLine: 3,
            },
          ],
        },
        {
          type: 'CIMPictureMarker',
          markerPlacement: {
            type: 'CIMMarkerPlacementAtExtremities',
            angleToLine: true,
            extremityPlacement: 'JustEnd',
            offsetAlongLine: 0,
          },
          enable: true,
          url: 'arrow/arrow-ios-forward-svgrepo-com.svg',
          size: 32,
          tintColor: [0, 0, 0, 255],
        },
      ],
    },
  },
});
