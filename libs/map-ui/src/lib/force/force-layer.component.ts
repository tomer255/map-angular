import { Component } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import Field from '@arcgis/core/layers/support/Field.js';
import { labelSymbol, buleMarkerSymbol } from '../utilities/symbols';
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster.js';
import FeatureReductionSelection from '@arcgis/core/layers/support/FeatureReductionSelection';
import { FeatureLayerComponent } from '../feature/feature-layer.component';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
@Component({
  selector: 'forces-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class ForceLayerComponent extends FeatureLayerComponent {
  featureReductionCluster = new FeatureReductionCluster({
    clusterRadius: 100,
    symbol: buleMarkerSymbol,
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
    title: 'forces-layer',
    source: [],
    fields: [
      new Field({ name: 'id', type: 'oid' }),
      new Field({ name: 'name', type: 'string' }),
      new Field({ name: 'type', type: 'string' }),
      new Field({ name: 'level', type: 'string' }),
    ],
    objectIdField: 'id',
    geometryType: 'point',
    labelingInfo: [
      new LabelClass({
        labelExpressionInfo: {
          expression: '$feature.level',
        },
        labelPlacement: 'above-center',
        symbol: labelSymbol,
      }),
      new LabelClass({
        labelExpressionInfo: {
          expression: '$feature.name',
        },
        labelPlacement: 'below-center',
        symbol: labelSymbol,
      }),
    ],
    renderer: new UniqueValueRenderer({
      field: 'type',
      defaultSymbol: buleMarkerSymbol,
      uniqueValueInfos: [
        {
          label: 'force type 1',
          value: '1',
          symbol: new PictureMarkerSymbol({
            url: 'symbols/force-type-1.svg',
            width: 36,
            height: 24,
          }),
        },
        {
          label: 'force type 2',
          value: '2',
          symbol: new PictureMarkerSymbol({
            url: 'symbols/force-type-2.svg',
            width: 36,
            height: 24,
          }),
        },
      ],
    }),
  });

  setClasster(show: boolean) {
    if (show) this.layer.featureReduction = this.featureReductionCluster;
    else this.layer.featureReduction = this.featureReductionSelection;
  }
}
