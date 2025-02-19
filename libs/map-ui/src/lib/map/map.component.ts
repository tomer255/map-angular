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
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView.js';
import Basemap from '@arcgis/core/Basemap.js';

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

  map = new Map({
    basemap: new Basemap({
      baseLayers: [
        new VectorTileLayer({
          url: 'https://cdn.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json',
          title: 'my-Vector',
          visible: true,
        }),
      ],
    }),
  });

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
