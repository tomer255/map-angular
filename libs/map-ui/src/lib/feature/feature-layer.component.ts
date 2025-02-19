import { Component, Host, OnDestroy, OnInit } from '@angular/core';
import { LibMapComponent } from '../map/map.component';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

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

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
  }

  ngOnInit(): void {
    this.parent.map.add(this.layer);
  }

  ngOnDestroy(): void {
    this.parent.map.remove(this.layer);
  }
}
