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
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import { promiseHook } from '../promise.hook';

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

  mapReady = promiseHook();
  content = promiseHook();

  constructor() {
    this.init();
  }

  async init() {
    await this.mapReady.promise;
    await this.content.promise;
    console.log(this.mapService.map(), this.x());
  }

  ngAfterContentInit(): void {
    this.content.resolve();
  }

  arcgisViewReadyChange(map: ArcgisMapCustomEvent<unknown>) {
    this.mapService.map.set(map);
    this.mapService.loaded.set(true);
    this.mapReady.resolve();
    this.test(map);
  }

  test(map: ArcgisMapCustomEvent<unknown>) {
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
    map.target.addLayer(layer);
  }
}
