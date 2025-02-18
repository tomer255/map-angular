import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import { ArcgisMapCustomEvent } from '@arcgis/map-components';
import Point from '@arcgis/core/geometry/Point.js';
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';
import { promiseHook } from '../promise.hook';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer.js';
import LabelClass from '@arcgis/core/layers/support/LabelClass';

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LibMapComponent {
  mapReady = promiseHook<HTMLArcgisMapElement>();

  arcgisViewReadyChange(map: ArcgisMapCustomEvent<unknown>) {
    this.mapReady.resolve(map.target);
    // this.testFeatureLayer(map.target);
  }

  testFeatureLayer(map: HTMLArcgisMapElement) {
    const layer = new FeatureLayer({
      spatialReference: { wkid: 4326 },
      title: 'my-layer',
      source: [],
      fields: [
        {
          name: 'id',
          alias: 'id',
          type: 'oid',
        },
        {
          name: 'status',
          alias: 'status',
          type: 'integer',
        },
        {
          name: 'name',
          alias: 'name',
          type: 'string',
        },
      ],
      objectIdField: 'id',
      geometryType: 'point',
      renderer: new UniqueValueRenderer({
        field: 'status',
        defaultSymbol: new SimpleMarkerSymbol({
          color: 'green',
        }),
        legendOptions: { title: 'bla' },
        uniqueValueInfos: [
          {
            label: 'Red Type Symbol',
            symbol: new PictureMarkerSymbol({
              url: 'symbols/inferno.svg',
              width: 32,
              height: 32,
            }),
            value: 1,
          },
          {
            label: 'Blue Type Symbol',
            symbol: new SimpleMarkerSymbol({
              color: 'blue',
            }),
            value: 2,
          },
        ],
      }),
      labelingInfo: [
        new LabelClass({
          labelExpressionInfo: {
            expression: '$feature.name',
          },
          labelPlacement: 'below-center',
          symbol: {
            type: 'text',
            haloColor: '#FFF',
            haloSize: 1,
            color: '#000',
            font: {
              size: 12,
            },
          },
        }),
      ],
    });
    map.addLayer(layer);

    const graphicRed1 = new Graphic({
      attributes: {
        id: '1',
        status: '1', // RED
        address: 'place.address',
        name: 'name 1',
      },
      geometry: new Point({ x: 34.89, y: 31.674 }),
    });
    const graphicRed2 = new Graphic({
      attributes: {
        id: '2',
        status: '1', // RED
        address: 'place.address',
        name: 'name 2',
      },
      geometry: new Point({ x: 34.79, y: 31.674 }),
    });
    const graphicBlue1 = new Graphic({
      attributes: {
        id: '3',
        status: '2', // BLUE
        address: 'place.address',
        name: 'name 3',
      },
      geometry: new Point({ x: 34.89, y: 31.774 }),
    });
    const graphicBlue2 = new Graphic({
      attributes: {
        id: '4',
        status: '2', // BLUE
        address: 'place.address',
        name: 'name 4',
      },
      geometry: new Point({ x: 34.79, y: 31.774 }),
    });

    layer.applyEdits({
      addFeatures: [graphicBlue1, graphicBlue2, graphicRed1, graphicRed2],
    });
  }
}
