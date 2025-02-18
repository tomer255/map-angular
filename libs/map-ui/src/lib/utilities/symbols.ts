import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import TextSymbol from '@arcgis/core/symbols/TextSymbol.js';

export const symbolFire = new PictureMarkerSymbol({
  url: 'symbols/inferno.svg',
  width: 32,
  height: 32,
});

export const blueMarkerSymbol = new SimpleMarkerSymbol({
  color: 'blue',
});

export const greenMarkerSymbol = new SimpleMarkerSymbol({
  color: 'green',
});

export const labelSymbol = new TextSymbol({
  haloColor: '#FFF',
  haloSize: 1,
  color: '#000',
  font: {
    size: 12,
  },
});
