import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SketchService } from '@map-angular/map-ui';
import Graphic from '@arcgis/core/Graphic';
import Collection from '@arcgis/core/core/Collection.js';

@Component({
  selector: 'app-sketch-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sketch-ui.component.html',
  styleUrl: './sketch-ui.component.scss',
  providers: [],
})
export class SketchUiComponent {
  sketchService = inject(SketchService);

  fillColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const hex = target.value;
    this.sketchService.fillColorHex = hex;
  }

  fillOpacityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const opacity = target.valueAsNumber;
    this.sketchService.fillOpacity = opacity;
  }

  outlineColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const hex = target.value;
    this.sketchService.outlineColorHex = hex;
  }

  outlineOpacityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const opacity = target.valueAsNumber;
    this.sketchService.outlineOpacity = opacity;
  }

  setWidth(event: Event) {
    const target = event.target as HTMLInputElement;
    this.sketchService.width = target.valueAsNumber;
  }

  setText(event: Event) {
    const target = event.target as HTMLInputElement;
    this.sketchService.text = target.value;
  }

  setFontSize(event: Event) {
    const target = event.target as HTMLInputElement;
    this.sketchService.fontSize = target.valueAsNumber;
  }

  textColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.sketchService.TextColorHex = target.value;
  }

  save() {
    const graphics = JSON.stringify(
      this.sketchService.sketchModel.layer.graphics
        .toArray()
        .map((g) => g.toJSON())
    );
    localStorage.setItem('graphics', graphics);
  }

  laod() {
    const str = localStorage.getItem('graphics');
    if (!str) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphics = JSON.parse(str) as any[];
    this.sketchService.sketchModel.layer.graphics = new Collection(
      graphics.map((data) => Graphic.fromJSON(data))
    );
  }
}
