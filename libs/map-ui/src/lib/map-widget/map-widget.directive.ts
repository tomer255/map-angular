import { Directive, effect, ElementRef, inject, input } from '@angular/core';
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
export class MapWidgetDirective {
  position = input.required<Position>();
  mapService = inject(MapService);
  constructor(el: ElementRef) {
    effect(() => {
      console.log(this.mapService.map());
    });
    const map = this.mapService.map();
    if (!map) return;
    map.target.view.ui.add(el.nativeElement, {
      position: this.position(),
    });
  }
}
