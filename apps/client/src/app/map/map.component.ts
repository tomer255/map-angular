import { Component, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import {
  LibMapComponent,
  MapWidgetDirective,
  Event,
  EllipseComponent,
  Ellipse,
  EllipsesLayerComponent,
  EventsLayerComponent,
  EventComponent,
} from '@map-angular/map-ui';
import Point from '@arcgis/core/geometry/Point';
import Extent from '@arcgis/core/geometry/Extent.js';
import { getEllipses } from '../generator/ellipses';
import { getEvents } from '../generator/events';

declare global {
  interface Window {
    test: any;
  }
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    LibMapComponent,
    MapWidgetDirective,
    EllipsesLayerComponent,
    EllipseComponent,
    EventsLayerComponent,
    EventComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  providers: [],
})
export class AppMapComponent {
  mapComponent = viewChild(LibMapComponent);
  async goTo() {
    const mapComponent = this.mapComponent();
    if (!mapComponent) return;
    const view = await mapComponent.viewReady.promise;
    const testPint = new Point({
      x: 34.890398187602784,
      y: 31.774515514156032,
    });
    const extent = new Extent({ ymax: 0.1 });
    extent.centerAt(testPint);
    view.goTo(extent, {
      animationMode: 'always',
    });
  }

  events = signal<Event[]>([]);

  ellipses = signal<Ellipse[]>([]);

  constructor() {
    window.test = {
      events: {
        generat: (amount: number) => {
          return this.events.set(getEvents(amount));
        },
        clear: () => this.events.set([]),
      },
      ellipses: {
        generat: (amount: number) => {
          return this.ellipses.set(getEllipses(amount));
        },
        clear: () => this.ellipses.set([]),
      },
    };
  }
}
