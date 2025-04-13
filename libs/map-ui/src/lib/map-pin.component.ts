import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import { GraphicComponent } from './graphic/graphic.component';

@Component({
  selector: 'map-pin',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class MapPinComponent extends GraphicComponent implements OnChanges {
  location = input<{ x: number; y: number }>();
  override graphic = new Graphic({
    geometry: new Point(),
    symbol: new PictureMarkerSymbol({
      url: 'symbols/map-pin.svg',
      width: 24,
      height: 32,
      yoffset: 16,
    }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'])
      this.graphic.geometry = new Point(changes['location'].currentValue);
  }
}
