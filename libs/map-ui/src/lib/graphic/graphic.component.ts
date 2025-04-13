import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { GraphicLayerService } from './graphic.service';

@Component({
  selector: 'feature',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class GraphicComponent implements OnDestroy, OnInit {
  graphicLayerService = inject(GraphicLayerService);
  graphic = new Graphic();

  add() {
    this.graphicLayerService.layer.add(this.graphic);
  }

  update() {}

  delete() {
    this.graphicLayerService.layer.remove(this.graphic);
  }

  ngOnInit(): void {
    this.add();
  }

  ngOnDestroy() {
    this.delete();
  }
}
