import { Component, Host, OnDestroy, OnInit } from '@angular/core';
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

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
  }

  ngOnInit() {
    this.parent.map.add(this.layer);
  }
  ngOnDestroy() {
    this.parent.map.remove(this.layer);
  }
}
