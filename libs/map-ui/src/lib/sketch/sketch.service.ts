import { Injectable } from '@angular/core';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SketchModel from '@arcgis/core/widgets/Sketch/SketchViewModel';

@Injectable({
  providedIn: 'root',
})
export class SketchService {
  sketchModel = new SketchModel({
    pointSymbol: { type: 'simple-marker' },
    polygonSymbol: { type: 'simple-fill' },
    polylineSymbol: { type: 'simple-line' },
    defaultCreateOptions: {
      mode: 'hybrid',
    },
    defaultUpdateOptions: {
      toggleToolOnClick: false,
      tool: 'transform',
    },
    updateOnGraphicClick: true,
  });

  updateMapper: {
    [key in __esri.SketchViewModelUpdateEvent['state']]: (
      event: __esri.SketchViewModelUpdateEvent
    ) => void;
  } = {
    start: (event) => {
      console.log(event);
      const graphic = event.graphics[0];
      console.log(this.sketchModel.polygonSymbol.color);

      if (graphic.symbol instanceof SimpleFillSymbol) {
        this.sketchModel.polygonSymbol.color.r = graphic.symbol.color.r;
        this.sketchModel.polygonSymbol.color.g = graphic.symbol.color.g;
        this.sketchModel.polygonSymbol.color.b = graphic.symbol.color.b;
      }
    },
    active: (event) => {
      console.log(event);
    },
    complete: (event) => {
      console.log(event);
    },
  };

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).SketchService = this;
    this.sketchModel.on(
      'update',
      (event: __esri.SketchViewModelUpdateEvent) => {
        this.updateMapper[event.state](event);
      }
    );
  }

  hexToRGB(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw Error();
    const [, r, g, b] = result.map((i) => parseInt(i, 16));
    return { r, g, b };
  }

  RGBToHex({ r, g, b }: { r: number; g: number; b: number }) {
    return (
      '#' +
      [r, g, b].map((number) => number.toString(16).padStart(2, '0')).join('')
    );
  }

  get fillColor() {
    return this.RGBToHex(this.sketchModel.polygonSymbol.color);
  }

  set fillColor(hex: string) {
    const { r, g, b } = this.hexToRGB(hex);
    this.sketchModel.polygonSymbol.color.r = r;
    this.sketchModel.polygonSymbol.color.g = g;
    this.sketchModel.polygonSymbol.color.b = b;
  }

  get fillOpacity() {
    return this.sketchModel.polygonSymbol.color.a;
  }

  set fillOpacity(opacity: number) {
    this.sketchModel.polygonSymbol.color.a = opacity;
  }

  get outlineColor() {
    if (this.sketchModel.polygonSymbol instanceof SimpleFillSymbol) {
      return this.RGBToHex(this.sketchModel.polygonSymbol.outline.color);
    }
    return '#000000';
  }

  set outlineColor(hex: string) {
    if (this.sketchModel.polygonSymbol instanceof SimpleFillSymbol) {
      const { r, g, b } = this.hexToRGB(hex);
      this.sketchModel.polygonSymbol.outline.color.r = r;
      this.sketchModel.polygonSymbol.outline.color.g = g;
      this.sketchModel.polygonSymbol.outline.color.b = b;
    }
  }

  get outlineOpacity() {
    if (this.sketchModel.polygonSymbol instanceof SimpleFillSymbol)
      return this.sketchModel.polygonSymbol.outline.color.a;
    return 0;
  }

  set outlineOpacity(opacity: number) {
    if (this.sketchModel.polygonSymbol instanceof SimpleFillSymbol)
      this.sketchModel.polygonSymbol.outline.color.a = opacity;
  }
}
