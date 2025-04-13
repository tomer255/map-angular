import { inject, Injectable } from '@angular/core';
import SketchModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import { MapService } from '../map/map.service';
import { GraphicLayerService } from '../graphic/graphic.service';

@Injectable({
  providedIn: 'root',
})
export class SketchService {
  mapService = inject(MapService);
  graphicLayerService = inject(GraphicLayerService);
  sketchModel = new SketchModel({
    pointSymbol: { type: 'simple-marker' },
    polygonSymbol: { type: 'simple-fill' },
    polylineSymbol: { type: 'simple-line' },
  });

  constructor() {
    this.sketchModel.view = this.mapService.view;
    this.sketchModel.layer = this.graphicLayerService.layer;
  }
}
