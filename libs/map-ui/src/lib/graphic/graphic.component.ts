import { Component, Host, OnDestroy } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { GraphicsLayerComponent } from './graphics-layer.component';

@Component({
  selector: 'feature',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class GraphicComponent implements OnDestroy {
  parent: GraphicsLayerComponent;
  graphic = new Graphic();

  constructor(@Host() parent: GraphicsLayerComponent) {
    this.parent = parent;
  }

  add() {
    this.parent.layer.add(this.graphic);
  }

  update() {}

  delete() {
    this.parent.layer.remove(this.graphic);
  }

  ngOnDestroy() {
    this.delete();
  }
}
