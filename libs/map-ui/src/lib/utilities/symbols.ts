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

export const labelSymbol = new TextSymbol({
  haloColor: '#FFF',
  haloSize: 1,
  color: '#000',
  font: {
    size: 12,
  },
});

export const redEllipse = new SimpleFillSymbol({
  color: [255, 0, 0, 0.1],
  outline: { color: [255, 0, 0], width: '1px' },
});
