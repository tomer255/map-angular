import { Injectable, OnDestroy, signal } from '@angular/core';
import FillSymbol from '@arcgis/core/symbols/FillSymbol';
import LineSymbol from '@arcgis/core/symbols/LineSymbol';
import SketchModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import Color from '@arcgis/core/Color';

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
      if (graphic.symbol instanceof FillSymbol) {
        for (const symbol of this.newOutlines) {
          symbol.width = graphic.symbol.outline.width;
          symbol.color = graphic.symbol.outline.color;
        }
        for (const symbol of this.newFills) {
          symbol.color = graphic.symbol.color;
        }
      }

      if (graphic.symbol instanceof LineSymbol) {
        for (const symbol of this.newOutlines) {
          symbol.width = graphic.symbol.width;
          symbol.color = graphic.symbol.color;
        }
        for (const symbol of this.newFills) {
          symbol.outline.color = graphic.symbol.color;
        }
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

  private get newOutlines() {
    const result: LineSymbol[] = [];
    if (this.sketchModel.polygonSymbol instanceof FillSymbol) {
      result.push(this.sketchModel.polygonSymbol.outline);
    }
    if (this.sketchModel.polylineSymbol instanceof LineSymbol)
      result.push(this.sketchModel.polylineSymbol);
    return result;
  }

  private get outlines() {
    const result: LineSymbol[] = this.newOutlines;

    this.sketchModel.updateGraphics.forEach((graphic) => {
      if (graphic.symbol instanceof FillSymbol) {
        result.push(graphic.symbol.outline);
      }
      if (graphic.symbol instanceof LineSymbol) {
        result.push(graphic.symbol);
      }
    });
    return result;
  }

  private get newFills() {
    const result: FillSymbol[] = [];
    if (this.sketchModel.polygonSymbol instanceof FillSymbol)
      result.push(this.sketchModel.polygonSymbol);
    return result;
  }

  private get fills() {
    const result: FillSymbol[] = this.newFills;
    for (const graphic of this.sketchModel.updateGraphics)
      if (graphic.symbol instanceof FillSymbol) result.push(graphic.symbol);

    return result;
  }

  get fillColorHex() {
    return this.sketchModel.polygonSymbol.color.toHex();
  }

  set fillColorHex(hex: string) {
    const { r, g, b } = new Color(hex);
    this.fillColor = { r, g, b };
  }

  get outlineColorHex() {
    if (this.sketchModel.polygonSymbol instanceof FillSymbol) {
      return this.sketchModel.polygonSymbol.outline.color.toHex();
    }
    return '#000000';
  }

  set outlineColorHex(hex: string) {
    const { r, g, b } = new Color(hex);
    this.outlineColor = { r, g, b };
  }

  get fillColor() {
    return this.sketchModel.polygonSymbol.color;
  }

  set fillColor({ r, g, b }: { r: number; g: number; b: number }) {
    this.fills.forEach((symbol) => {
      symbol.color.r = r;
      symbol.color.g = g;
      symbol.color.b = b;
    });
  }

  get fillOpacity() {
    return this.sketchModel.polygonSymbol.color.a;
  }

  set fillOpacity(opacity: number) {
    this.fills.forEach((symbol) => {
      symbol.color.a = opacity;
    });
  }

  get outlineColor() {
    if (this.sketchModel.polygonSymbol instanceof FillSymbol) {
      return this.sketchModel.polygonSymbol.outline.color;
    }
    return new Color('#000000');
  }

  set outlineColor({ r, g, b }: { r: number; g: number; b: number }) {
    this.outlines.forEach((symbol) => {
      symbol.color.r = r;
      symbol.color.g = g;
      symbol.color.b = b;
    });
  }

  get outlineOpacity() {
    return this.sketchModel.polylineSymbol.color.a;
  }

  set outlineOpacity(opacity: number) {
    this.outlines.forEach((symbol) => {
      symbol.color.a = opacity;
    });
  }

  set width(width: number) {
    this.outlines.forEach((symbol) => {
      symbol.width = width;
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
