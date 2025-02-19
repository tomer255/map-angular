import { Component, viewChild } from '@angular/core';
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
import { center } from '@turf/turf';

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

  events: Event[] = [
    {
      id: '1',
      status: '1',
      name: 'event 1',
      coordinate: { x: 34.89, y: 31.674 },
    },
    {
      id: '2',
      status: '2',
      name: 'event 2',
      coordinate: { x: 34.79, y: 31.674 },
    },
    {
      id: '3',
      status: '1',
      name: 'event 3',
      coordinate: { x: 34.89, y: 31.774 },
    },
    {
      id: '4',
      status: '1',
      name: 'event 4',
      coordinate: { x: 34.79, y: 31.774 },
    },
  ];

  ellipses: Ellipse[] = [
    {
      id: 1,
      xCenter: 34.59,
      yCenter: 31.674,
      angle: 48,
      xSemiAxis: 4,
      ySemiAxis: 3,
    },
    {
      id: 2,
      xCenter: 34.69,
      yCenter: 31.774,
      angle: 180,
      xSemiAxis: 2,
      ySemiAxis: 3,
    },
  ];
}
