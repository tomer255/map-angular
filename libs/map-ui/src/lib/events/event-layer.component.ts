import { Component } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import Field from '@arcgis/core/layers/support/Field.js';
import {
  chemicalSymbol,
  greenMarkerSymbol,
  labelSymbol,
  fireSymbol,
} from '../utilities/symbols';
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster.js';
import FeatureReductionSelection from '@arcgis/core/layers/support/FeatureReductionSelection';
import { FeatureLayerComponent } from '../feature/feature-layer.component';
@Component({
  selector: 'events-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class EventsLayerComponent extends FeatureLayerComponent {
  featureReductionCluster = new FeatureReductionCluster({
    clusterRadius: 100,
    symbol: greenMarkerSymbol,
    clusterMaxSize: 24,
    clusterMinSize: 24,
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
  featureReductionSelection = new FeatureReductionSelection();
  override layer = new FeatureLayer({
    spatialReference: { wkid: 4326 },
    title: 'events-layer',
    source: [],
    fields: [
      new Field({ name: 'id', type: 'oid' }),
      new Field({ name: 'status', type: 'string' }),
      new Field({ name: 'name', type: 'string' }),
    ],
    objectIdField: 'id',
    geometryType: 'point',
    labelingInfo: [
      new LabelClass({
        labelExpressionInfo: {
          expression: '$feature.name',
        },
        labelPlacement: 'below-center',
        symbol: labelSymbol,
      }),
    ],
    renderer: new UniqueValueRenderer({
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
          symbol: chemicalSymbol,
          value: '2',
        },
      ],
    }),
  });

  setClasster(show: boolean) {
    if (show) this.layer.featureReduction = this.featureReductionCluster;
    else this.layer.featureReduction = this.featureReductionSelection; // undefined as any;
  }
}
