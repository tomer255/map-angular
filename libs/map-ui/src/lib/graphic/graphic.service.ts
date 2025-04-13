import { Injectable } from '@angular/core';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

@Injectable({
  providedIn: null,
})
export class GraphicLayerService {
  layer = new GraphicsLayer();
}
