import { Component, Host, input, OnChanges } from '@angular/core';
import Point from '@arcgis/core/geometry/Point';
import { FeatureComponent } from '../feature/feature.component';
import { ForceLayerComponent } from './force-layer.component';
import { SimpleChangesTyped } from '../utilities/types';

export type Force = {
  id: string;
  name: string;
  type: '1' | '2';
  level: '1' | '2';
  coordinate: { x: number; y: number };
};

@Component({
  selector: 'force',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class ForceComponent extends FeatureComponent implements OnChanges {
  force = input.required<Force>();

  constructor(@Host() parent: ForceLayerComponent) {
    super();
    this.parent = parent;
  }

  updateGraphic(event: Force) {
    this.graphic.geometry = new Point(event.coordinate);
    this.graphic.attributes = event;
  }

  ngOnChanges(changes: SimpleChangesTyped<ForceComponent>) {
    const { firstChange, currentValue } = changes.force;
    this.updateGraphic(currentValue);
    if (firstChange) return this.add();
    this.update();
  }
}
