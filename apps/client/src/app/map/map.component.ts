import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import {
  EllipseComponent,
  GraphicsLayerComponent,
  FeatureLayerComponent,
  LibMapComponent,
  MapWidgetDirective,
  mapEvent,
  MapEventComponent,
} from '@map-angular/map-ui';
import Point from '@arcgis/core/geometry/Point';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    LibMapComponent,
    MapWidgetDirective,
    GraphicsLayerComponent,
    EllipseComponent,
    FeatureLayerComponent,
    MapEventComponent,
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
    const map = await mapComponent.mapReady.promise;
    const testPint = new Point({
      x: 34.890398187602784,
      y: 31.774515514156032,
    });
    map.view.goTo(testPint, {
      animationMode: 'always',
    });
  }

  events: mapEvent[] = [
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
}
