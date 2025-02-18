import { Component, input, OnInit } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import { FeatureComponent } from '../feature/feature.component';

export type mapEvent = {
  id: string;
  status: '1' | '2';
  name: string;
  coordinate: { x: number; y: number };
};

@Component({
  selector: 'map-event',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class MapEventComponent extends FeatureComponent implements OnInit {
  event = input.required<mapEvent>();

  override ngOnInit(): void {
    console.log('evetn:', this.event());

    this.graphic = new Graphic({
      attributes: this.event(),
      geometry: new Point(this.event().coordinate),
    });
    super.ngOnInit();
  }
}
