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
    const map = this.mapService.map();
    if (!map) return;
    map.target.view.ui.add(this.el.nativeElement, {
      position: this.position(),
    });
  }
}
