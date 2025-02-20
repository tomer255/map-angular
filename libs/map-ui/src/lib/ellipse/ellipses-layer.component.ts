import { Component } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer.js';
import { redEllipse } from '../utilities/symbols';
import Field from '@arcgis/core/layers/support/Field';
import { FeatureLayerComponent } from '../feature/feature-layer.component';
import { GraphicsLayerComponent } from '../graphic/graphics-layer.component';

@Component({
  selector: 'ellipses-layer',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class EllipsesLayerComponent extends GraphicsLayerComponent {
  // override layer = new FeatureLayer({
  //   spatialReference: { wkid: 4326 },
  //   title: 'test-feature-layer',
  //   source: [],
  //   fields: [
  //     new Field({ name: 'id', type: 'oid' }),
  //     new Field({ name: 'label', type: 'string' }),
  //   ],
  //   objectIdField: 'id',
  //   geometryType: 'polygon',
  //   renderer: new SimpleRenderer({
  //     label: 'label',
  //     symbol: redEllipse,
  //   }),
  // });
}
