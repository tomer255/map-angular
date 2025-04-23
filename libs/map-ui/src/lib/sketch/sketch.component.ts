import { Component, inject } from '@angular/core';
import { MapService } from '../map/map.service';
import { GraphicLayerService } from '../graphic/graphic.service';
import { SketchService } from './sketch.service';

@Component({
  selector: 'sketch',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class SketchComponent {
  mapService = inject(MapService);
  graphicLayerService = inject(GraphicLayerService);
  sketchService = inject(SketchService);

  constructor() {
    this.sketchService.sketchModel.view = this.mapService.view;
    this.sketchService.sketchModel.layer = this.graphicLayerService.layer;
  }
}
