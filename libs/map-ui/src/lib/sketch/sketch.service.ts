import { Injectable, OnDestroy, signal } from '@angular/core';
import FillSymbol from '@arcgis/core/symbols/FillSymbol';
import LineSymbol from '@arcgis/core/symbols/LineSymbol';
import SketchModel from '@arcgis/core/widgets/Sketch/SketchViewModel';

type Tool = 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'freehand';

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
      preserveAspectRatio: false,
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
      if (
        graphic.symbol instanceof FillSymbol &&
        this.sketchModel.polygonSymbol instanceof FillSymbol
      ) {
        this.sketchModel.polygonSymbol.color = graphic.symbol.color;
        this.sketchModel.polygonSymbol.outline.color =
          graphic.symbol.outline.color;
      }
      if (graphic.symbol instanceof LineSymbol) {
        this.sketchModel.polylineSymbol.color = graphic.symbol.color;
      }
      if (
        this.sketchModel.polygonSymbol instanceof FillSymbol &&
        graphic.symbol instanceof FillSymbol
      ) {
        this.sketchModel.polygonSymbol.outline.color =
          graphic.symbol.outline.color;
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
      this.activeTool.set(null);
      this.sketchModel.layer.graphics = this.sketchModel.layer.graphics.map(
        (g) => g.clone()
      );
    },
    cancel: () => {
      this.activeTool.set(null);
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

  activeTool = signal<Tool | null>(null);

  create(tool: Tool) {
    if (this.activeTool() == tool) {
      this.sketchModel.cancel();
      return;
    }
    this.activeTool.set(tool);
    switch (tool) {
      case 'circle':
      case 'polygon':
      case 'polyline':
      case 'rectangle':
        this.sketchModel.create(tool);
        break;
      case 'freehand':
        this.sketchModel.create('polyline', { mode: 'freehand' });
        break;

      default:
        break;
    }
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
      if (graphic.symbol instanceof FillSymbol) {
        graphic.symbol.color.r = r;
        graphic.symbol.color.g = g;
        graphic.symbol.color.b = b;
      }
    });
  }

  get fillOpacity() {
    return this.sketchModel.polygonSymbol.color.a;
  }

  set fillOpacity(opacity: number) {
    this.sketchModel.polygonSymbol.color.a = opacity;
    this.sketchModel.updateGraphics.forEach((graphic) => {
      if (graphic.symbol instanceof FillSymbol)
        graphic.symbol.color.a = opacity;
    });
  }

  get outlineColor() {
    if (this.sketchModel.polygonSymbol instanceof FillSymbol) {
      return this.RGBToHex(this.sketchModel.polygonSymbol.outline.color);
    }
    return '#000000';
  }

  set outlineColor(hex: string) {
    const { r, g, b } = this.hexToRGB(hex);
    if (this.sketchModel.polygonSymbol instanceof FillSymbol) {
      this.sketchModel.polygonSymbol.outline.color.r = r;
      this.sketchModel.polygonSymbol.outline.color.g = g;
      this.sketchModel.polygonSymbol.outline.color.b = b;
    }

    this.sketchModel.polylineSymbol.color.r = r;
    this.sketchModel.polylineSymbol.color.g = g;
    this.sketchModel.polylineSymbol.color.b = b;

    this.sketchModel.updateGraphics.forEach((graphic) => {
      if (graphic.symbol instanceof FillSymbol) {
        graphic.symbol.outline.color.r = r;
        graphic.symbol.outline.color.g = g;
        graphic.symbol.outline.color.b = b;
      }
      if (graphic.symbol instanceof LineSymbol) {
        graphic.symbol.color.r = r;
        graphic.symbol.color.g = g;
        graphic.symbol.color.b = b;
      }
    });
  }

  get outlineOpacity() {
    return this.sketchModel.polylineSymbol.color.a;
  }

  set outlineOpacity(opacity: number) {
    if (this.sketchModel.polygonSymbol instanceof FillSymbol)
      this.sketchModel.polygonSymbol.outline.color.a = opacity;

    this.sketchModel.updateGraphics.forEach((graphic) => {
      if (graphic.symbol instanceof FillSymbol)
        graphic.symbol.outline.color.a = opacity;
    });

    this.sketchModel.updateGraphics.forEach((graphic) => {
      if (graphic.symbol instanceof FillSymbol) {
        graphic.symbol.outline.color.a = opacity;
      }
      if (graphic.symbol instanceof LineSymbol) {
        graphic.symbol.color.a = opacity;
      }
    });
  }

  set width(width: number) {
    if (this.sketchModel.polylineSymbol instanceof LineSymbol)
      this.sketchModel.polylineSymbol.width = width;
    if (this.sketchModel.polygonSymbol instanceof FillSymbol)
      this.sketchModel.polygonSymbol.outline.width = width;

    this.sketchModel.updateGraphics.forEach((graphic) => {
      if (graphic.symbol instanceof FillSymbol) {
        graphic.symbol.outline.width = width;
      }
      if (graphic.symbol instanceof LineSymbol) {
        graphic.symbol.width = width;
      }
    });
  }

  get width() {
    if (this.sketchModel.polylineSymbol instanceof LineSymbol)
      return this.sketchModel.polylineSymbol.width;
    if (this.sketchModel.polygonSymbol instanceof FillSymbol)
      return this.sketchModel.polygonSymbol.outline.width;
    return 0.7;
  }
}
