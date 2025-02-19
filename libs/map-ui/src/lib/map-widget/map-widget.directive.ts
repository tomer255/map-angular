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

  async ngOnInit(): Promise<void> {
    const view = await this.parent.viewReady.promise;
    view.ui.add(this.elementRef.nativeElement, {
      position: this.position(),
    });
  }

  async ngOnDestroy(): Promise<void> {
    const view = await this.parent.viewReady.promise;
    view.ui.remove(this.elementRef.nativeElement);
  }
}
