import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MapService } from '../map/map.service';

type UIAddPosition =
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
export class MapWidgetDirective implements OnInit, OnDestroy {
  position = input.required<UIAddPosition>();
  elementRef = inject(ElementRef);
  mapService = inject(MapService);

  ngOnInit() {
    this.mapService.view.ui.add(this.elementRef.nativeElement, {
      position: this.position(),
    });
  }

  ngOnDestroy() {
    this.mapService.view.ui.remove(this.elementRef.nativeElement);
  }
}
