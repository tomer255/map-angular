import { Component, Host, input, OnDestroy, OnInit } from '@angular/core';
import { ellipse, Units } from '@turf/turf';
import Polygon from '@arcgis/core/geometry/Polygon';
import Graphic from '@arcgis/core/Graphic';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import { EllipsesLayerComponent } from './ellipses-layer.component';
import { FeatureComponent } from '../feature/feature.component';

export type Ellipse = {
  id: number;
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
export class EllipseComponent extends FeatureComponent {
  ellipse = input.required<Ellipse>();

  constructor(@Host() parent: EllipsesLayerComponent) {
    super();
    this.parent = parent;
  }

  override async ngOnInit() {
    const ellipseT = ellipse(
      [this.ellipse().xCenter, this.ellipse().yCenter],
      this.ellipse().xSemiAxis,
      this.ellipse().ySemiAxis,
      {
        units: 'kilometers' as Units,
        angle: this.ellipse().angle,
      }
    );
    this.graphic.attributes = this.ellipse();
    this.graphic.geometry = new Polygon({
      spatialReference: { wkid: 4326 },
      rings: ellipseT.geometry.coordinates,
    });
    this.graphic.symbol = new SimpleFillSymbol({
      color: [255, 0, 0, 0.1],
      outline: { color: [255, 0, 0], width: '1px' },
    });
    await super.ngOnInit();
  }
}
