import { AfterContentInit, Component, signal, viewChild } from '@angular/core';
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
export class AppMapComponent implements AfterContentInit {
  libMap = viewChild(LibMapComponent);
  eventsLayer = viewChild(EventsLayerComponent);
  ellipsesLayer = viewChild(EllipsesLayerComponent);
  async resetView() {
    const mapComponent = this.libMap();
    if (!mapComponent) return;
    const view = await mapComponent.viewReady.promise;
    const point = new Point({
      x: 34.89,
      y: 31.77,
    });
    const extent = new Extent({ ymax: 3 });
    extent.centerAt(point);
    view.goTo(extent);
  }

  async ngAfterContentInit() {
    const mapComponent = this.libMap();
    if (!mapComponent) return;
    const view = await mapComponent.viewReady.promise;
    console.log({ view });

    view.on('click', async (event) => {
      const opts = {
        include: this.eventsLayer()?.layer,
      };
      const response = await view.hitTest(event, opts);
      console.log(response.results);
      const x = response.results[0] as __esri.MapViewGraphicHit;
      view.goTo(x.graphic.geometry);
    });
    view.on('click', async (event) => {
      const opts = {
        include: this.ellipsesLayer()?.layer,
      };
      const response = await view.hitTest(event, opts);
      console.log(response.results);
      const x = response.results[0];
      if (x?.type !== 'graphic') return;
      view.goTo(x.graphic);
    });
  }

  events = signal<Event[]>([]);

  ellipses = signal<Ellipse[]>([]);

  constructor() {
    window.test = {
      events: {
        generat: (amount: number) => {
          this.events.set(getEvents(amount));
        },
        clear: () => this.events.set([]),
        show: () => this.events(),
      },
      ellipses: {
        generat: (amount: number) => {
          this.ellipses.set(getEllipses(amount));
        },
        clear: () => this.ellipses.set([]),
        show: () => this.events(),
      },
    };
  }
}
