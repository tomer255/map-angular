import Color from '@arcgis/core/Color';
import { CIMSymbol } from '@arcgis/core/symbols';

export const setPointText = (
  symbol: CIMSymbol,
  option: { text?: string; textColor?: Color }
) => {
  const vectorMarker = symbol.data.symbol?.symbolLayers?.find(
    (layer) => layer.type === 'CIMVectorMarker'
  );
  if (!vectorMarker) return;
  const markerGraphic = vectorMarker.markerGraphics.find(
    (g) => g.type === 'CIMMarkerGraphic'
  );
  if (!markerGraphic) return;
  if (option.text) markerGraphic.textString = option.text;
  if (!option.textColor) return;
  if (markerGraphic.symbol.type !== 'CIMTextSymbol') return;
  const solidFill = markerGraphic.symbol.symbol.symbolLayers.find(
    (layer) => layer.type == 'CIMSolidFill'
  );
  if (!solidFill) return;
  solidFill.color[0] = option.textColor.r;
  solidFill.color[1] = option.textColor.g;
  solidFill.color[2] = option.textColor.b;
};

export const setPointIcon = (
  symbol: CIMSymbol,
  option: { url?: string | null }
) => {
  const pictureMarker = symbol.data.symbol?.symbolLayers?.find(
    (layer) => layer.type === 'CIMPictureMarker'
  );
  if (!pictureMarker) return;
  if (option.url) pictureMarker.url = option.url;
};

const iconSize = 24;

const textSymbol: __esri.CIMTextSymbol = {
  type: 'CIMTextSymbol',
  fontFamilyName: 'Arial',
  height: 12,
  verticalAlignment: 'Top',
  horizontalAlignment: 'Center',
  haloSize: 5,
  symbol: {
    type: 'CIMPolygonSymbol',
    symbolLayers: [
      {
        type: 'CIMSolidFill',
        enable: true,
        color: [0, 0, 0, 255],
      },
    ],
  },
};

const markerGraphic: __esri.CIMMarkerGraphic = {
  type: 'CIMMarkerGraphic',
  textString: 'Text',
  geometry: { x: 0, y: -(iconSize / 2) },
  symbol: textSymbol,
};

const vectorMarker: __esri.CIMVectorMarker = {
  type: 'CIMVectorMarker',
  enable: true,
  size: iconSize,
  markerGraphics: [markerGraphic],
  frame: {
    xmin: -(iconSize / 2),
    ymin: -(iconSize / 2),
    xmax: iconSize / 2,
    ymax: iconSize / 2,
  },
};

export const CIMPoint = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    symbol: {
      type: 'CIMPointSymbol',
      symbolLayers: [
        {
          type: 'CIMPictureMarker',
          url: '/icons/agriculture-farm-farming.svg',
          enable: true,
          size: iconSize,
        },
        vectorMarker,
      ],
    },
  },
});
