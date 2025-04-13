import { Component } from '@angular/core';
import SketchModel from '@arcgis/core/widgets/Sketch/SketchViewModel';

@Component({
  selector: 'sketch',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class SketchComponent {
  sketchModel = new SketchModel();
}
