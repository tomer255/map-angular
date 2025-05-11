import Color from '@arcgis/core/Color';
import { CIMSymbol } from '@arcgis/core/symbols';

export const changeText = (
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

export const changeIcon = (
  symbol: CIMSymbol,
  option: { url?: string | null }
) => {
  const pictureMarker = symbol.data.symbol?.symbolLayers?.find(
    (layer) => layer.type === 'CIMPictureMarker'
  );
  if (!pictureMarker) return;
  if (option.url) pictureMarker.url = option.url;
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
          size: 24,
        },
        {
          type: 'CIMVectorMarker',
          enable: true,
          size: 1,
          colorLocked: true,
          anchorPointUnits: 'Relative',
          frame: {
            xmin: -1,
            ymin: -1,
            xmax: 1,
            ymax: 1,
          },
          markerGraphics: [
            {
              type: 'CIMMarkerGraphic',
              geometry: {
                x: 0,
                y: -24,
              },
              symbol: {
                type: 'CIMTextSymbol',
                fontFamilyName: 'Arial',
                fontStyleName: 'Bold',
                height: 20,
                horizontalAlignment: 'Center',
                offsetX: 0,
                offsetY: 0,
                symbol: {
                  type: 'CIMPolygonSymbol',
                  symbolLayers: [
                    {
                      type: 'CIMSolidFill',
                      enable: true,
                      color: [89, 31, 147, 255],
                    },
                  ],
                },
                verticalAlignment: 'Center',
              },
              textString: 'hello!',
            },
          ],
          scaleSymbolsProportionally: true,
          respectFrame: true,
        },
      ],
    },
  },
});
