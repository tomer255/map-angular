import { Component, Host, OnDestroy, OnInit } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { GraphicsLayerComponent } from './graphics-layer.component';

@Component({
  selector: 'feature',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class GraphicComponent implements OnDestroy {
  parent: GraphicsLayerComponent | undefined;
  graphic = new Graphic();

  constructor(@Host() parent: GraphicsLayerComponent) {
    this.parent = parent;
  }

  add() {
    if (!this.parent) return;
    this.parent.layer.add(this.graphic);
  }

  update() {
    this.delete();
    this.add();
  }

  delete() {
    if (!this.parent) return;
    this.parent.layer.remove(this.graphic);
  }

  ngOnDestroy() {
    this.delete();
  }
}
