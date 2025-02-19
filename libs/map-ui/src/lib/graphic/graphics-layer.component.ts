import {
  Component,
  ElementRef,
  Host,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LibMapComponent } from '../map/map.component';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

@Component({
  selector: 'graphics-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class GraphicsLayerComponent implements OnInit, OnDestroy {
  layer = new GraphicsLayer();
  parent: LibMapComponent;
  elementRef = inject(ElementRef);

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
  }

  async ngOnInit(): Promise<void> {
    this.parent.map.add(this.layer);
  }
  async ngOnDestroy(): Promise<void> {
    this.parent.map.remove(this.layer);
  }
}
