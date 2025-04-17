import TextSymbol from '@arcgis/core/symbols/TextSymbol.js';
import { Component, input } from '@angular/core';
import { GraphicComponent } from './graphic/graphic.component';
import { SimpleChangesTyped } from './utilities/types';
import Point from '@arcgis/core/geometry/Point';

type Coordinates = {
  x: number;
  y: number;
};

@Component({
  selector: 'map-text',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class TextComponent extends GraphicComponent {
  coordinates = input.required<Coordinates>();

  updateGraphic(input: Coordinates) {
    this.graphic.geometry = new Point({
      spatialReference: { wkid: 4326 },
      x: input.x,
      y: input.y,
    });
    this.graphic.symbol = new TextSymbol({
      text: 'בדיקה',
      //   backgroundColor: 'red',
      haloColor: 'red',
      haloSize: 3,
      font: {
        size: 24,
        weight: 'bold',
      },
    });
  }

  ngOnChanges(changes: SimpleChangesTyped<TextComponent>): void {
    if (changes.coordinates)
      this.updateGraphic(changes.coordinates.currentValue);
  }
}
