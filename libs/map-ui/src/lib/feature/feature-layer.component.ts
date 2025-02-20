import { Component, Host, OnDestroy, OnInit } from '@angular/core';
import { LibMapComponent } from '../map/map.component';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'feature-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class FeatureLayerComponent implements OnInit, OnDestroy {
  layer = new FeatureLayer({
    spatialReference: { wkid: 4326 },
    title: 'feature-layer',
    source: [],
    fields: [],
  });
  parent: LibMapComponent;
  timerId: number;

  features: {
    addFeatures: Graphic[];
    updateFeatures: Graphic[];
    deleteFeatures: Graphic[];
  } = {
    addFeatures: [],
    updateFeatures: [],
    deleteFeatures: [],
  };

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
    this.timerId = setInterval(() => {
      this.layer.applyEdits(this.features);
      this.features = {
        addFeatures: [],
        updateFeatures: [],
        deleteFeatures: [],
      };
    }, 100);
  }

  ngOnInit(): void {
    this.parent.map.add(this.layer);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
    this.parent.map.remove(this.layer);
  }
}
