import {
  Component,
  inject,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import { MapService } from './map/map.service';

@Component({
  selector: 'vector-tile-layer',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content/>',
  schemas: [],
})
export class VectorTileLayerComponent implements OnChanges {
  url = input.required<string>();
  title = input.required<string>();
  visible = input.required<boolean>();
  mapService = inject(MapService);

  vectorTileLayer = new VectorTileLayer();

  constructor() {
    this.mapService.map.basemap.baseLayers.add(this.vectorTileLayer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) this.vectorTileLayer.url = changes['url'].currentValue;
    if (changes['title'])
      this.vectorTileLayer.title = changes['title'].currentValue;
    if (changes['visible'])
      this.vectorTileLayer.visible = changes['visible'].currentValue;
  }
}
