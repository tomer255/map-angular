import {
  Component,
  inject,
  input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import { MapService } from '../map/map.service';

@Component({
  selector: 'feature-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class FeatureLayerComponent implements OnDestroy, OnChanges {
  visible = input<boolean>(true);
  layer = new FeatureLayer({
    spatialReference: { wkid: 4326 },
    title: 'feature-layer',
    source: [],
    fields: [],
  });
  timerId: number;
  mapService = inject(MapService);

  features: {
    addFeatures: Graphic[];
    updateFeatures: Graphic[];
    deleteFeatures: Graphic[];
  } = {
    addFeatures: [],
    updateFeatures: [],
    deleteFeatures: [],
  };

  constructor() {
    this.mapService.map.add(this.layer);
    this.timerId = setInterval(() => {
      this.layer.applyEdits(this.features);
      this.features = {
        addFeatures: [],
        updateFeatures: [],
        deleteFeatures: [],
      };
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'])
      this.layer.visible = changes['visible'].currentValue;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
    this.mapService.map.remove(this.layer);
  }
}
