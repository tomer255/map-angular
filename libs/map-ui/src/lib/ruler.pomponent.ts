import { Component, OnInit, signal } from '@angular/core';
import Point from '@arcgis/core/geometry/Point';
import { GraphicsLayerComponent } from './graphic/graphics-layer.component';
import Polyline from '@arcgis/core/geometry/Polyline';
import Graphic from '@arcgis/core/Graphic';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

@Component({
  selector: 'ruler',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class RulerComponent extends GraphicsLayerComponent {
  lastPoint = new Graphic({
    geometry: new Point(),
    symbol: new PictureMarkerSymbol({
      url: 'symbols/target.svg',
      width: 24,
      height: 24,
    }),
  });

  length = signal<number>(0);

  line = new Graphic({
    symbol: new SimpleLineSymbol({
      color: [55, 55, 255],
      width: 2,
      join: 'round',
      style: 'long-dash',
    }),
    geometry: new Polyline({
      paths: [[]],
    }),
  });

  reset() {
    this.lastPoint.geometry = new Point();
    this.line.geometry = new Polyline({ paths: [[]] });
    this.length.set(0);
    this.layer.visible = false;
  }

  addPoint(point: Point) {
    this.layer.visible = true;
    this.line.geometry = (this.line.geometry as Polyline)
      .insertPoint(0, 0, point)
      .clone();
    this.lastPoint.geometry = point.clone();

    const length = geometryEngine.geodesicLength(
      this.line.geometry,
      'kilometers'
    );
    this.length.set(length);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.layer.add(this.line);
    this.layer.add(this.lastPoint);
  }
}
