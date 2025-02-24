import { Component, input, SimpleChanges } from '@angular/core';
import { ellipse as turfEllipse, Units } from '@turf/turf';
import Polygon from '@arcgis/core/geometry/Polygon';
import { GraphicComponent } from './graphic/graphic.component';
import { fillRedSymbol } from './utilities/symbols';

export type Ellipse = {
  id: string;
  xCenter: number;
  yCenter: number;
  xSemiAxis: number;
  ySemiAxis: number;
  angle: number;
};

const MINUTE = 1000 * 60;

@Component({
  selector: 'ellipse',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class EllipseComponent extends GraphicComponent {
  ellipse = input.required<Ellipse>();
  // time = input.required<Date>();

  setColor() {
    const now = new Date();
    const threshold1 = new Date(now.getTime() - 1 * MINUTE);
  }

  updateGraphic(ellipse: Ellipse) {
    const ellipseT = turfEllipse(
      [ellipse.xCenter, ellipse.yCenter],
      ellipse.xSemiAxis,
      ellipse.ySemiAxis,
      {
        units: 'kilometers' as Units,
        angle: ellipse.angle,
      }
    );
    this.graphic.attributes = ellipse;
    this.graphic.geometry = new Polygon({
      spatialReference: { wkid: 4326 },
      rings: ellipseT.geometry.coordinates,
    });
    this.graphic.symbol = fillRedSymbol;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { firstChange, currentValue } = changes['ellipse'];
    this.updateGraphic(currentValue);
    if (firstChange) {
      this.add();
      return;
    }
  }
}
