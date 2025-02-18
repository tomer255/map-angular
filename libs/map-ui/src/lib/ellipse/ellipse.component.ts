import {
  Component,
  ElementRef,
  Host,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GraphicsLayerComponent } from '../graphics-layer/graphics-layer.component';
import { ellipse, Units } from '@turf/turf';
import Polygon from '@arcgis/core/geometry/Polygon';
import Graphic from '@arcgis/core/Graphic';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

@Component({
  selector: 'ellipse',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class EllipseComponent implements OnInit, OnDestroy {
  graphic = new Graphic();
  xCenter = input.required<number>();
  yCenter = input.required<number>();
  xSemiAxis = input.required<number>();
  ySemiAxis = input.required<number>();
  angle = input.required<number>();
  parent: GraphicsLayerComponent;
  elementRef = inject(ElementRef);

  constructor(@Host() parent: GraphicsLayerComponent) {
    this.parent = parent;
  }

  async ngOnInit(): Promise<void> {
    const ellipseT = ellipse(
      [this.xCenter(), this.yCenter()],
      this.xSemiAxis(),
      this.ySemiAxis(),
      {
        units: 'kilometers' as Units,
        angle: this.angle(),
      }
    );

    const testPolygon1 = new Polygon({
      hasM: false,
      hasZ: false,
      spatialReference: { wkid: 4326 },
      rings: ellipseT.geometry.coordinates,
    });

    this.graphic.geometry = testPolygon1;
    this.graphic.symbol = new SimpleFillSymbol({
      color: [255, 0, 0, 0.1],
      outline: { color: [255, 0, 0], width: '1px' },
    });

    this.parent.layer.add(this.graphic);
  }

  ngOnDestroy(): void {
    this.parent.layer.remove(this.graphic);
  }
}
