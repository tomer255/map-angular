import {
  Component,
  ElementRef,
  Host,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LibMapComponent } from '../map/map.component';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import Field from '@arcgis/core/layers/support/Field.js';
import {
  blueMarkerSymbol,
  greenMarkerSymbol,
  labelSymbol,
  fireSymbol,
} from '../utilities/symbols';
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster.js';
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
    fields: [
      new Field({ name: 'id', type: 'oid' }),
      new Field({ name: 'status', type: 'string' }),
      new Field({ name: 'name', type: 'string' }),
    ],
    objectIdField: 'id',
    geometryType: 'point',
  });
  parent: LibMapComponent;
  elementRef = inject(ElementRef);

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
  }

  async ngOnInit(): Promise<void> {
    const map = await this.parent.mapReady.promise;
    this.layer.objectIdField = 'id';
    this.layer.featureReduction = new FeatureReductionCluster({
      type: 'cluster',
      clusterRadius: 100,
      symbol: greenMarkerSymbol,
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: '$feature.cluster_count',
          },
          deconflictionStrategy: 'none',
          labelPlacement: 'center-center',
          symbol: labelSymbol,
        },
      ],
    });
    this.layer.labelingInfo = [
      new LabelClass({
        labelExpressionInfo: {
          expression: '$feature.name',
        },
        labelPlacement: 'below-center',
        symbol: labelSymbol,
      }),
    ];
    this.layer.renderer = new UniqueValueRenderer({
      field: 'status',
      defaultSymbol: greenMarkerSymbol,
      legendOptions: { title: 'bla' },
      uniqueValueInfos: [
        {
          label: 'Red Type Symbol',
          symbol: fireSymbol,
          value: '1',
        },
        {
          label: 'Blue Type Symbol',
          symbol: blueMarkerSymbol,
          value: '2',
        },
      ],
    });
    map.addLayer(this.layer);
  }

  async ngOnDestroy(): Promise<void> {
    const map = await this.parent.mapReady.promise;
    // TODO : remove layer
  }
}
