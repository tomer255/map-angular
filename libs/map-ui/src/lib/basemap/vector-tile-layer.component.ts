import {
  Component,
  effect,
  Host,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import '@arcgis/map-components/dist/components/arcgis-basemap-gallery';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import { BasemapComponent } from './basemap.component';
import { LibMapComponent } from '../map/map.component';

@Component({
  selector: 'vector-tile-layer',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content/>',
  schemas: [],
})
export class VectorTileLayerComponent implements OnInit {
  parent: LibMapComponent;
  url = input.required<string>();
  title = input.required<string>();
  visible = input.required<boolean>();

  vectorTileLayer = new VectorTileLayer();

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
    effect(() => {
      this.vectorTileLayer.visible = this.visible();
    });
  }

  ngOnInit(): void {
    console.log(this.url());
    this.vectorTileLayer.url = this.url();
    this.vectorTileLayer.title = this.title();

    this.parent.map.layers.add(this.vectorTileLayer);
    this.vectorTileLayer.refresh();
  }
}
