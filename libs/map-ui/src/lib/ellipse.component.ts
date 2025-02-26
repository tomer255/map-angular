import { Component, input, SimpleChanges } from '@angular/core';
import { ellipse as turfEllipse, Units } from '@turf/turf';
import Polygon from '@arcgis/core/geometry/Polygon';
import { GraphicComponent } from './graphic/graphic.component';
import {
  fillBlackSymbol,
  fillBlueSymbol,
  fillRedSymbol,
} from './utilities/symbols';
import { SimpleChangesTyped } from './utilities/types';

export type Ellipse = {
  id: string;
  xCenter: number;
  yCenter: number;
  xSemiAxis: number;
  ySemiAxis: number;
  angle: number;
  time: Date;
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
  timer: number | undefined;

  setColor(ellipse: Ellipse) {
    clearTimeout(this.timer);
    const delta = ellipse.time.getTime() - new Date().getTime();
    const result = [
      { timeout: delta + 0.5 * MINUTE, symbol: fillRedSymbol },
      { timeout: delta + 1.0 * MINUTE, symbol: fillBlueSymbol },
      { timeout: delta + 1.5 * MINUTE, symbol: fillBlackSymbol },
    ].find(({ timeout }) => timeout > 0);
    if (!result) return;
    const { timeout, symbol } = result;
    this.graphic.symbol = symbol;
    if (!timeout) return;
    this.timer = setTimeout(() => this.setColor(ellipse), timeout);
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
    this.setColor(ellipse);
  }

  ngOnChanges(changes: SimpleChangesTyped<EllipseComponent>): void {
    const { firstChange, currentValue } = changes.ellipse;
    this.updateGraphic(currentValue);
    if (firstChange) {
      this.add();
      return;
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    clearTimeout(this.timer);
  }
}
