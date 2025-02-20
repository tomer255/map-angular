import {
  AfterContentInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import '@arcgis/map-components/dist/components/arcgis-basemap-gallery';
import { promiseHook } from '../promise.hook';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView.js';

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LibMapComponent implements AfterContentInit {
  viewReady = promiseHook<MapView>();

  map = new Map();

  ngAfterContentInit(): void {
    const view = new MapView({
      map: this.map, // References a Map instance
      container: 'viewDiv',
      center: [34.89, 31.77],
      zoom: 7,
    });
    this.viewReady.resolve(view);
  }
}
