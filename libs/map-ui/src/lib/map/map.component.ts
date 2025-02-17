import {
  AfterContentInit,
  Component,
  contentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import { ArcgisMapCustomEvent } from '@arcgis/map-components';
import { MapService } from './map.service';
import Point from '@arcgis/core/geometry/Point.js';
import Polygon from '@arcgis/core/geometry/Polygon';
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';
import { ellipse, Units } from '@turf/turf';

import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import { promiseHook } from '../promise.hook';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer.js';
// import TextSymbol from '@arcgis/core/symbols/TextSymbol.js';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol.js';

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LibMapComponent implements AfterContentInit {
  mapService = inject(MapService);
  x = contentChild('getme');

  content = promiseHook<undefined>();

  ngAfterContentInit(): void {
    this.content.resolve(undefined);
  }

  arcgisViewReadyChange(map: ArcgisMapCustomEvent<unknown>) {
    this.mapService.loaded.set(true);
    this.mapService.mapReady.resolve(map);
    this.testFeatureLayer(map.target);
    this.testPoly(map.target);
  }

  testGraphicsLayer(map: HTMLArcgisMapElement) {
    const testPint = new Point({
      x: 34.890398187602784,
      y: 31.774515514156032,
    });
    const symbol = new SimpleMarkerSymbol({
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      color: 'red',
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [128, 128, 128, 0.5],
        width: '0.5px',
      },
    });
    const graphic = new Graphic({
      attributes: {
        ObjectId: 'place.id',
        address: 'place.address',
      },
      geometry: testPint,
      symbol,
    });
    const layer = new GraphicsLayer({
      graphics: [graphic],
    });
    map.addLayer(layer);
  }

  testFeatureLayer(map: HTMLArcgisMapElement) {
    const layer = new FeatureLayer({
      spatialReference: { wkid: 4326 },
      title: 'my-layer',
      source: [],
      fields: [
        {
          name: 'ObjectId',
          alias: 'ObjectId',
          type: 'oid',
        },
        {
          name: 'place',
          alias: 'Place',
          type: 'string',
        },
        {
          name: 'status',
          alias: 'status',
          type: 'string',
        },
        {
          name: 'name',
          alias: 'name',
          type: 'string',
        },
      ],
      objectIdField: 'ObjectId',
      geometryType: 'point',
    });
    map.addLayer(layer);

    const defaultSymbol = new SimpleMarkerSymbol({
      color: 'green',
      outline: {
        color: [128, 128, 128, 0.5],
        width: '0.5px',
      },
    });

    const symbolRed = new PictureMarkerSymbol({
      url: 'symbols/inferno-svgrepo-com.svg',
      width: 32,
      height: 32,
    });

    const symbolBlue = new SimpleMarkerSymbol({
      color: 'blue',
      outline: {
        color: [128, 128, 128, 0.5],
        width: '0.5px',
      },
    });

    // const cimSymbol = new CIMSymbol({
    //   data: {
    //     type: 'CIMSymbolReference',
    //     symbol: {
    //       type: 'CIMPointSymbol',
    //       symbolLayers: [
    //         {
    //           type: 'CIMPictureMarker',
    //           url: 'symbols/inferno-svgrepo-com.svg',
    //           enable: true,
    //           size: 32,
    //         },
    //         {
    //           type: 'CIMVectorMarker',
    //           enable: true,
    //           size: 10,
    //           colorLocked: true,
    //           anchorPointUnits: 'Relative',
    //           frame: {
    //             xmin: -5,
    //             ymin: -5,
    //             xmax: 5,
    //             ymax: 5,
    //           },
    //           offsetY: -20,
    //           markerGraphics: [
    //             {
    //               type: 'CIMMarkerGraphic',
    //               geometry: {
    //                 x: 0,
    //                 y: 0,
    //               },
    //               symbol: {
    //                 type: 'CIMTextSymbol',
    //                 fontFamilyName: 'Arial',
    //                 fontStyleName: 'Bold',
    //                 height: 10,
    //                 horizontalAlignment: 'Center',
    //                 offsetX: 0,
    //                 offsetY: 0,
    //                 symbol: {
    //                   type: 'CIMPolygonSymbol',
    //                   symbolLayers: [
    //                     {
    //                       type: 'CIMSolidFill',
    //                       enable: true,
    //                       color: [41, 214, 41, 255],
    //                     },
    //                   ],
    //                 },
    //                 verticalAlignment: 'Center',
    //               },
    //               textString: '{name}',
    //             },
    //           ],
    //           scaleSymbolsProportionally: true,
    //           respectFrame: true,
    //         },
    //       ],
    //     },
    //   },
    // });

    const uniqueValueInfos = [
      {
        label: 'Red Type Symbol',
        symbol: symbolRed,
        value: '1',
      },
      {
        label: 'Blue Type Symbol',
        symbol: symbolBlue,
        value: '2',
      },
    ];

    const renderer = {
      type: 'unique-value',
      field: 'status',
      defaultSymbol,
      defaultLabel: '1',
      legendOptions: { title: 'bla' },
      uniqueValueInfos,
    };
    layer.renderer = new UniqueValueRenderer(renderer);

    const testPointRed1 = new Point({ x: 34.89, y: 31.674 });
    const testPointRed2 = new Point({ x: 34.79, y: 31.674 });
    const testPointBlue1 = new Point({ x: 34.89, y: 31.774 });
    const testPointBlue2 = new Point({ x: 34.79, y: 31.774 });

    const graphicRed1 = new Graphic({
      attributes: {
        ObjectId: '1',
        status: '1', // RED
        address: 'place.address',
        name: 'name 1',
      },
      geometry: testPointRed1,
    });
    const graphicRed2 = new Graphic({
      attributes: {
        ObjectId: '2',
        status: '1', // RED
        address: 'place.address',
        name: 'name 2',
      },
      geometry: testPointRed2,
    });
    const graphicBlue1 = new Graphic({
      attributes: {
        ObjectId: '3',
        status: '2', // BLUE
        address: 'place.address',
        name: 'name 3',
      },
      geometry: testPointBlue1,
    });
    const graphicBlue2 = new Graphic({
      attributes: {
        ObjectId: '4',
        status: '2', // BLUE
        address: 'place.address',
        name: 'name 4',
      },
      geometry: testPointBlue2,
    });

    const labelClass = new LabelClass({
      labelExpressionInfo: {
        expression: '$feature.name',
      },
      labelPlacement: 'below-center',
      minScale: 1000000,
      symbol: {
        type: 'text',
        color: 'green',
        font: {
          size: 12,
        },
      },
    });
    layer.labelsVisible = true;
    layer.labelingInfo = [labelClass];
    layer.applyEdits({
      addFeatures: [graphicRed1, graphicRed2, graphicBlue1, graphicBlue2],
    });
  }

  testPoly(map: HTMLArcgisMapElement) {
    const ellipseT = ellipse([34.89, 31.674], 2, 4, {
      units: 'kilometers' as Units,
      angle: 45,
    });

    const testPolygon1 = new Polygon({
      hasM: false,
      hasZ: false,
      spatialReference: { wkid: 4326 },
      rings: ellipseT.geometry.coordinates,
    });

    console.log(ellipseT.geometry.coordinates);

    const graphicPolygon = new Graphic({
      attributes: {
        ObjectId: '5',
        name: 'elli 1',
      },
      geometry: testPolygon1,
      symbol: new SimpleFillSymbol({
        color: [255, 0, 0, 0.1],
        outline: { color: [255, 0, 0], width: '1px' },
      }),
    });

    const layer = new GraphicsLayer({
      graphics: [graphicPolygon],
    });

    map.addLayer(layer);
  }
}
