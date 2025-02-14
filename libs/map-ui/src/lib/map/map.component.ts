import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';

import '@arcgis/map-components/dist/components/arcgis-zoom';
@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapComponent {
  arcgisViewChange(event: CustomEvent) {
    // @ts-ignore
    const { center, zoom } = event.target;
    console.log(
      'Center (lon/lat): ',
      `${center.longitude}, ${center.latitude}`
    );
    console.log('Zoom: ', zoom);
  }
}
