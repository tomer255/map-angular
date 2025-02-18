import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import { ArcgisMapCustomEvent } from '@arcgis/map-components';
import { promiseHook } from '../promise.hook';

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LibMapComponent {
  mapReady = promiseHook<HTMLArcgisMapElement>();

  arcgisViewReadyChange(map: ArcgisMapCustomEvent<unknown>) {
    this.mapReady.resolve(map.target);
  }
}
