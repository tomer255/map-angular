import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import TextSymbol from '@arcgis/core/symbols/TextSymbol.js';

export const fireSymbol = new PictureMarkerSymbol({
  url: 'symbols/inferno.svg',
  width: 24,
  height: 24,
});

export const chemicalSymbol = new PictureMarkerSymbol({
  url: 'symbols/nuclear.svg',
  width: 24,
  height: 24,
});

export const greenMarkerSymbol = new SimpleMarkerSymbol({
  color: 'green',
  size: 24,
});

export const buleMarkerSymbol = new SimpleMarkerSymbol({
  color: 'bule',
  size: 24,
});

export const labelSymbol = new TextSymbol({
  haloColor: '#FFF',
  haloSize: 1,
  color: '#000',
  font: {
    size: 12,
  },
});

export const fillRedSymbol = new SimpleFillSymbol({
  color: [255, 0, 0, 0.1],
  outline: { color: [255, 0, 0], width: '1px' },
});

export const fillYellowSymbol = new SimpleFillSymbol({
  color: [255, 255, 0, 0.1],
  outline: { color: [255, 255, 0], width: '1px' },
});

export const fillGreenSymbol = new SimpleFillSymbol({
  color: [0, 255, 0, 0.1],
  outline: { color: [0, 255, 0], width: '1px' },
});

export const fillBlueSymbol = new SimpleFillSymbol({
  color: [0, 0, 255, 0.1],
  outline: { color: [0, 0, 255], width: '1px' },
});

export const fillBlackSymbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0.1],
  outline: { color: [0, 0, 0], width: '1px' },
});

import CIMSymbol from '@arcgis/core/symbols/CIMSymbol.js';
export const cim = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    symbol: {
      type: 'CIMPointSymbol',
      symbolLayers: [
        {
          type: 'CIMPictureMarker',
          enable: true,
          url: 'symbols/map-pin.svg',
          size: 24,
        },
        {
          type: 'CIMPictureMarker',
          enable: true,
          url: 'symbols/inferno.svg',
          size: 24,
        },
      ],
    },
  },
});
