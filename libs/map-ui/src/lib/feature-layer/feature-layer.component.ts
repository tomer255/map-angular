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
  symbolFire,
} from '../utilities/symbols';

@Component({
  selector: 'feature-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class FeatureLayerComponent implements OnInit, OnDestroy {
  layer = new FeatureLayer({
    title: 'event-layer',
    spatialReference: { wkid: 4326 },
    source: [],
    geometryType: 'point',
    objectIdField: 'id',
  });
  parent: LibMapComponent;
  elementRef = inject(ElementRef);

  constructor(@Host() parent: LibMapComponent) {
    this.parent = parent;
  }

  async ngOnInit(): Promise<void> {
    const map = await this.parent.mapReady.promise;
    this.layer.objectIdField = 'id';

    this.layer.fields = [
      new Field({ name: 'id', type: 'oid' }),
      new Field({ name: 'status', type: 'string' }),
      new Field({ name: 'name', type: 'string' }),
    ];
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
          symbol: symbolFire,
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
