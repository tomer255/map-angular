import { Injectable, signal } from '@angular/core';
import { ArcgisMapCustomEvent } from '@arcgis/map-components';
import { promiseHook } from '../promise.hook';

@Injectable({
  providedIn: 'any',
})
export class MapService {
  loaded = signal<boolean>(false);
  mapReady = promiseHook<ArcgisMapCustomEvent<unknown>>();
}
