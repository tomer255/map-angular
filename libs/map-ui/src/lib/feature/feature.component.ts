import { Component, Host, OnDestroy, OnInit } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { FeatureLayerComponent } from './feature-layer.component';

@Component({
  selector: 'feature',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class FeatureComponent implements OnInit, OnDestroy {
  parent: FeatureLayerComponent | undefined;
  graphic = new Graphic();

  async ngOnInit() {
    if (!this.parent) return;
    await this.parent.layer.applyEdits({
      addFeatures: [this.graphic],
    });
  }
  async ngOnDestroy() {
    if (!this.parent) return;
    await this.parent.layer.applyEdits({
      deleteFeatures: [this.graphic],
    });
  }
}
