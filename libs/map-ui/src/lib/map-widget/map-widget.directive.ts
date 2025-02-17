import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { MapService } from '../map/map.service';

type Position =
  | 'bottom-leading'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-trailing'
  | 'top-leading'
  | 'top-left'
  | 'top-right'
  | 'top-trailing'
  | 'manual';

@Directive({
  standalone: true,
  selector: '[libMapWidget]',
})
export class MapWidgetDirective implements AfterViewInit {
  position = input.required<Position>();
  mapService = inject(MapService);
  el = inject(ElementRef);

  ngAfterViewInit(): void {
    this.initWidget();
  }

  async initWidget() {
    const map = await this.mapService.mapReady.promise;
    map.target.view.ui.add(this.el.nativeElement, {
      position: this.position(),
    });
    map.target.view.layerViews;
  }
}
