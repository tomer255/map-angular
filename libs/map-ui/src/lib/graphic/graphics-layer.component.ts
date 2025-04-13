import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '../map/map.service';
import { GraphicLayerService } from './graphic.service';

@Component({
  selector: 'graphics-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  providers: [GraphicLayerService],
})
export class GraphicsLayerComponent implements OnInit, OnDestroy {
  mapService = inject(MapService);
  graphicLayerService = inject(GraphicLayerService);

  ngOnInit() {
    this.mapService.map.add(this.graphicLayerService.layer);
  }
  ngOnDestroy() {
    this.mapService.map.remove(this.graphicLayerService.layer);
  }
}
