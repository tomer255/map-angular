import {
  Component,
  Host,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
export class EventComponent extends FeatureComponent implements OnChanges {
  event = input.required<Event>();

  constructor(@Host() parent: EventsLayerComponent) {
    super();
    this.parent = parent;
  }

  updateGraphic(event: Event) {
    this.graphic.geometry = new Point(event.coordinate);
    this.graphic.attributes = event;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { firstChange, currentValue } = changes['event'];
    this.updateGraphic(currentValue);
    if (firstChange) return this.add();
    this.update();
  }
}
