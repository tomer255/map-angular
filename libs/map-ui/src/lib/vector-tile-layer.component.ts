import { Component, effect, Host, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import { LibMapComponent } from './map/map.component';

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
    this.vectorTileLayer.url = this.url();
    this.vectorTileLayer.title = this.title();
    this.parent.map.basemap.baseLayers.add(this.vectorTileLayer);
  }
}
