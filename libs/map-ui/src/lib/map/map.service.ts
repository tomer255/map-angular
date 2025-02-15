import { Injectable, signal } from '@angular/core';
import { ArcgisMapCustomEvent } from '@arcgis/map-components';

@Injectable({
  providedIn: 'any',
})
export class MapService {
  map = signal<ArcgisMapCustomEvent<unknown> | null>(null);
}
