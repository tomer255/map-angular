import { Component, Host, input, SimpleChanges } from '@angular/core';
import { ellipse as turfEllipse, Units } from '@turf/turf';
import Polygon from '@arcgis/core/geometry/Polygon';
import Graphic from '@arcgis/core/Graphic';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import { EllipsesLayerComponent } from './ellipses-layer.component';
import { FeatureComponent } from '../feature/feature.component';
import { GraphicComponent } from '../graphic/graphic.component';

export type Ellipse = {
  id: string;
  xCenter: number;
  yCenter: number;
  xSemiAxis: number;
  ySemiAxis: number;
  angle: number;
};

@Component({
  selector: 'ellipse',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class EllipseComponent extends GraphicComponent {
  ellipse = input.required<Ellipse>();

  constructor(@Host() parent: EllipsesLayerComponent) {
    super();
    this.parent = parent;
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
    this.graphic.symbol = new SimpleFillSymbol({
      color: [255, 0, 0, 0.1],
      outline: { color: [255, 0, 0], width: '1px' },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { firstChange, currentValue } = changes['ellipse'];
    this.updateGraphic(currentValue);
    if (firstChange) return this.add();
    this.update();
  }
}
