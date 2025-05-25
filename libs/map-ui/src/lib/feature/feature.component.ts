import { Component, OnDestroy } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { FeatureLayerComponent } from './feature-layer.component';

@Component({
  selector: 'feature',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class FeatureComponent implements OnDestroy {
  parent: FeatureLayerComponent | undefined;
  graphic = new Graphic();

  add() {
    if (!this.parent) return;
    this.parent.features.changes = true;
    this.parent.features.addFeatures.push(this.graphic);
  }

  update() {
    if (!this.parent) return;
    this.parent.features.changes = true;
    this.parent.features.updateFeatures.push(this.graphic);
  }

  delete() {
    if (!this.parent) return;
    this.parent.features.changes = true;
    this.parent.features.deleteFeatures.push(this.graphic);
  }

  ngOnDestroy() {
    this.delete();
  }
}
