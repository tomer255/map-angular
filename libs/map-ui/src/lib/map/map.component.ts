import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import { ArcgisMapCustomEvent } from '@arcgis/map-components';
import Point from '@arcgis/core/geometry/Point.js';
import { MapService } from './map.service';
import { MapWidgetDirective } from '../map-widget/map-widget.directive';

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule, MapWidgetDirective],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MapService],
})
export class MapComponent {
  mapService = inject(MapService);
  // gotoEl = viewChild<ElementRef>('test');
  loaded = signal<boolean>(false);

  constructor() {
    effect(() => {
      console.log(this.loaded());
    });
  }

  arcgisViewReadyChange(map: ArcgisMapCustomEvent<unknown>) {
    this.mapService.map.set(map);
    this.loaded.set(true);

    // console.log(this.gotoEl());
    // map.target.view.ui.add(this.gotoEl()!.nativeElement, {
    //   position: 'top-right',
    // });
  }

  testPint = new Point({ x: 34.890398187602784, y: 31.774515514156032 });

  goTo() {
    this.mapService.map()?.target.view.goTo(this.testPint, {
      animationMode: 'always',
    });
  }
}
