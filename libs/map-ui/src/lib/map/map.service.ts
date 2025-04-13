import { ElementRef, inject, Injectable } from '@angular/core';
import Basemap from '@arcgis/core/Basemap';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  elementRef = inject(ElementRef);

  map = new Map({
    basemap: new Basemap(),
  });

  view = new MapView({
    map: this.map, // References a Map instance
    center: [34.89, 31.77],
    zoom: 7,
    ui: { components: [] },
    container: this.elementRef.nativeElement,
  });
}
