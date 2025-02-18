import { Component, Host, OnDestroy, OnInit } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { FeatureLayerComponent } from '../feature-layer/feature-layer.component';

@Component({
  selector: 'feature',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class FeatureComponent implements OnInit, OnDestroy {
  parent: FeatureLayerComponent;
  graphic = new Graphic();

  constructor(@Host() parent: FeatureLayerComponent) {
    this.parent = parent;
  }

  ngOnInit(): void {
    this.parent.layer.applyEdits({
      addFeatures: [this.graphic],
    });
  }
  ngOnDestroy(): void {
    this.parent.layer.applyEdits({
      deleteFeatures: [this.graphic],
    });
  }
}
