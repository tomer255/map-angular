import { Component, Host } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import '@arcgis/map-components/dist/components/arcgis-basemap-gallery';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Basemap from '@arcgis/core/Basemap';
import { LibMapComponent } from '../map/map.component';

@Component({
  selector: 'basemap',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content/>',
  schemas: [],
})
export class BasemapComponent {
  basemap = new Basemap();

  constructor(@Host() parent: LibMapComponent) {
    parent.map.basemap = this.basemap;
  }
}
