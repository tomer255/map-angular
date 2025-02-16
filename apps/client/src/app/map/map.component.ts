import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import { LibMapComponent, MapWidgetDirective } from '@map-angular/map-ui';
import { MapService } from '@map-angular/map-ui';
import Point from '@arcgis/core/geometry/Point.js';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, LibMapComponent, MapWidgetDirective],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  providers: [MapService],
})
export class AppMapComponent {
  mapService = inject(MapService);

  goTo() {
    const testPint = new Point({
      x: 34.890398187602784,
      y: 31.774515514156032,
    });
    this.mapService.map()?.target.view.goTo(testPint, {
      animationMode: 'always',
    });
  }
}
