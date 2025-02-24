import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LibMapComponent,
  MapWidgetDirective,
  Event as MapEvent,
  EllipseComponent,
  Ellipse,
  EventsLayerComponent,
  EventComponent,
  VectorTileLayerComponent,
  GraphicsLayerComponent,
  SectorComponent,
  fillRedSymbol,
  fillGreenSymbol,
  fillYellowSymbol,
  RulerComponent,
} from '@map-angular/map-ui';
import Point from '@arcgis/core/geometry/Point';
import Extent from '@arcgis/core/geometry/Extent.js';
import { getEllipses } from '../generator/ellipses';
import { getEvents } from '../generator/events';

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
    EllipseComponent,
    EventsLayerComponent,
    EventComponent,
    VectorTileLayerComponent,
    GraphicsLayerComponent,
    SectorComponent,
    RulerComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  providers: [],
})
export class AppMapComponent {
  libMap = viewChild(LibMapComponent);
  eventsLayer = viewChild(EventsLayerComponent);
  ruler = viewChild(RulerComponent);
  rulerActive = viewChild<ElementRef<HTMLInputElement>>('rulerActive');
  vis = signal<boolean>(true);

  fillRedSymbol = fillRedSymbol;
  fillGreenSymbol = fillGreenSymbol;
  fillYellowSymbol = fillYellowSymbol;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).vis = this.vis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).myTest = this.myTest;
  }

  viewClick(event: __esri.ViewClickEvent) {
    const point = event.mapPoint;
    if (!this.rulerActive()?.nativeElement.checked) return;
    this.ruler()?.addPoint(point);
  }

  parseInt = parseInt;

  changeEventClasster(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.eventsLayer()?.setClasster(checkbox.checked);
  }

  events = signal<MapEvent[]>([]);

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

  myTest = {
    view: {
      reset: () => {
        const view = this.libMap()?.view;
        if (!view) return;
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
      update: (event: MapEvent) => {
        this.events.update((events) =>
          events.map((e) => (e.id === event.id ? { ...event } : e))
        );
      },
      remove: (id: MapEvent['id']) => {
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
}
