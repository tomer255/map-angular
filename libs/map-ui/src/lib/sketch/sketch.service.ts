import { Injectable, OnDestroy } from '@angular/core';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SketchModel from '@arcgis/core/widgets/Sketch/SketchViewModel';

@Injectable({
  providedIn: 'root',
})
export class SketchService implements OnDestroy {
  updateHandle: IHandle;
  createHandle: IHandle;
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
      const graphic = event.graphics[0];

      this.sketchModel.polygonSymbol.color = graphic.symbol.color.clone();
      if (
        this.sketchModel.polygonSymbol instanceof SimpleFillSymbol &&
        graphic.symbol instanceof SimpleFillSymbol
      ) {
        this.sketchModel.polygonSymbol.outline.color =
          graphic.symbol.outline.color.clone();
      }
    },
    active: () => {
      // console.log(event);
    },
    complete: () => {
      // console.log(event);
    },
  };

  createMapper: {
    [key in __esri.SketchViewModelCreateEvent['state']]: (
      event: __esri.SketchViewModelCreateEvent
    ) => void;
  } = {
    start: () => {
      // console.log(event);
    },
    active: () => {
      // console.log(event);
    },
    complete: () => {
      this.sketchModel.layer.graphics = this.sketchModel.layer.graphics.map(
        (g) => g.clone()
      );
    },
    cancel: () => {
      // console.log(event);
    },
  };

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).sketchService = this;
    this.updateHandle = this.sketchModel.on(
      'update',
      (event: __esri.SketchViewModelUpdateEvent) => {
        this.updateMapper[event.state](event);
      }
    );
    this.createHandle = this.sketchModel.on(
      'create',
      (event: __esri.SketchViewModelCreateEvent) => {
        this.createMapper[event.state](event);
      }
    );
  }
  ngOnDestroy(): void {
    this.updateHandle.remove();
    this.createHandle.remove();
  }

  create(
    tool:
      | 'point'
      | 'multipoint'
      | 'polyline'
      | 'polygon'
      | 'rectangle'
      | 'circle'
  ) {
    if (this.sketchModel.activeTool == tool) {
      this.sketchModel.cancel();
      return;
    }
    this.sketchModel.create(tool);
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

    this.sketchModel.updateGraphics.forEach((graphic) => {
      graphic.symbol.color.r = r;
      graphic.symbol.color.g = g;
      graphic.symbol.color.b = b;
    });
  }

  get fillOpacity() {
    return this.sketchModel.polygonSymbol.color.a;
  }

  set fillOpacity(opacity: number) {
    this.sketchModel.polygonSymbol.color.a = opacity;
    this.sketchModel.updateGraphics.forEach((graphic) => {
      graphic.symbol.color.a = opacity;
    });
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
      this.sketchModel.updateGraphics.forEach((graphic) => {
        if (graphic.symbol instanceof SimpleFillSymbol) {
          graphic.symbol.outline.color.r = r;
          graphic.symbol.outline.color.g = g;
          graphic.symbol.outline.color.b = b;
        }
      });
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

    this.sketchModel.updateGraphics.forEach((graphic) => {
      if (graphic.symbol instanceof SimpleFillSymbol)
        graphic.symbol.outline.color.a = opacity;
    });
  }
}
