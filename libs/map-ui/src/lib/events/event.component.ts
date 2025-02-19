import { Component, Host, input, OnInit } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import { FeatureComponent } from '../feature/feature.component';
import { EventsLayerComponent } from './event-layer.component';

export type Event = {
  id: string;
  status: '1' | '2';
  name: string;
  coordinate: { x: number; y: number };
};

@Component({
  selector: 'event',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class EventComponent extends FeatureComponent implements OnInit {
  event = input.required<Event>();

  constructor(@Host() parent: EventsLayerComponent) {
    super();
    this.parent = parent;
  }

  override async ngOnInit() {
    const timer = 'Graphic-' + this.event().id;
    console.time(timer);
    this.graphic = new Graphic({
      attributes: this.event(),
      geometry: new Point(this.event().coordinate),
    });
    await super.ngOnInit();
    console.timeEnd(timer);
  }
}
