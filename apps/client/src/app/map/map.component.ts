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
  BasemapComponent,
  VectorTileLayerComponent,
} from '@map-angular/map-ui';
import Point from '@arcgis/core/geometry/Point';
import Extent from '@arcgis/core/geometry/Extent.js';
import { getEllipses } from '../generator/ellipses';
import { getEvents } from '../generator/events';

type MyTest = {
  view: {
    reset: () => Promise<void>;
  };
  lyaers: {
    chnage: (title: string) => void;
  };
  events: {
    generate: (amount: number) => void;
    clear: () => void;
    update: (event: Event) => void;
    remove: (id: Event['id']) => void;
    show: () => Event[];
  };
  ellipses: {
    generate: (amount: number) => void;
    clear: () => void;
    update: (event: Ellipse) => void;
    remove: (id: Ellipse['id']) => void;
    show: () => Ellipse[];
  };
};

declare global {
  interface Window {
    myTest: MyTest;
  }
}

type BaseLayer = {
  url: string;
  title: string;
  visible: boolean;
};

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
    BasemapComponent,
    VectorTileLayerComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  providers: [],
})
export class AppMapComponent implements AfterContentInit {
  libMap = viewChild(LibMapComponent);
  eventsLayer = viewChild(EventsLayerComponent);
  ellipsesLayer = viewChild(EllipsesLayerComponent);
  VectorTileLayer = viewChild(VectorTileLayerComponent);
  vis = signal<boolean>(true);

  async ngAfterContentInit() {
    (window as any).vis = this.vis;
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

  parseInt = parseInt;

  events = signal<Event[]>([]);

  ellipses = signal<Ellipse[]>([]);

  baseLayers = signal<BaseLayer[]>([
    {
      url: 'https://cdn.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json',
      title: 'A',
      visible: true,
    },
    {
      url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer',
      title: 'B',
      visible: false,
    },
  ]);

  myTest: MyTest = {
    view: {
      reset: async () => {
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
      },
    },
    lyaers: {
      chnage: (title: string) => {
        this.baseLayers.update((prev) =>
          prev.map((l) => ({ ...l, visible: l.title === title }))
        );
      },
    },
    events: {
      generate: (amount: number) => {
        this.events.update((prev) => [...prev, ...getEvents(amount)]);
      },
      clear: () => this.events.set([]),
      update: (event: Event) => {
        this.events.update((events) =>
          events.map((e) => (e.id === event.id ? { ...event } : e))
        );
      },
      remove: (id: Event['id']) => {
        this.events.update((events) => events.filter((e) => e.id !== id));
      },
      show: () => this.events(),
    },
    ellipses: {
      generate: (amount: number) => {
        this.ellipses.update((prev) => [...prev, ...getEllipses(amount)]);
      },
      clear: () => this.ellipses.set([]),
      update: (ellipse: Ellipse) => {
        this.ellipses.update((ellipses) =>
          ellipses.map((e) => (e.id === ellipse.id ? { ...ellipse } : e))
        );
      },
      remove: (id: Ellipse['id']) => {
        this.ellipses.update((ellipses) => ellipses.filter((e) => e.id !== id));
      },
      show: () => this.ellipses(),
    },
  };

  constructor() {
    window.myTest = this.myTest;
  }
}
