import {
  Directive,
  ElementRef,
  Host,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LibMapComponent } from '../map/map.component';

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
  parent: LibMapComponent;
  elementRef = inject(ElementRef);

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
  }

  ngOnInit() {
    this.parent.view.ui.add(this.elementRef.nativeElement, {
      position: this.position(),
    });
  }

  ngOnDestroy() {
    this.parent.view.ui.remove(this.elementRef.nativeElement);
  }
}
