import { Injectable, OnDestroy, signal } from '@angular/core';
import FillSymbol from '@arcgis/core/symbols/FillSymbol';
import LineSymbol from '@arcgis/core/symbols/LineSymbol';
import SketchModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import Color from '@arcgis/core/Color';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import {
  CIMLine,
  setLineColor,
  setLineSize,
  setLineStroke,
  StrokeOption,
} from './CIMLine';
import { CIMSymbol, SimpleFillSymbol } from '@arcgis/core/symbols';
import { CIMPoint, setPointIcon, setPointText } from './CIMPoint';

type Tool =
  | 'text'
  | 'icon'
  | 'polyline'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'freehand';

@Injectable({
  providedIn: 'root',
})
export class SketchService implements OnDestroy {
  updateHandle: IHandle;
  createHandle: IHandle;

  textSymbol = new TextSymbol({ text: 'text' });
  simpleFillSymbol = new SimpleFillSymbol();

  sketchModel = new SketchModel({
    pointSymbol: CIMPoint,
    polygonSymbol: this.simpleFillSymbol,
    polylineSymbol: CIMLine,
    defaultCreateOptions: {
      mode: 'hybrid',
      preserveAspectRatio: false,
    },
    defaultUpdateOptions: {
      toggleToolOnClick: true,
      tool: 'transform',
      multipleSelectionEnabled: false,
    },
    updateOnGraphicClick: true,
    snappingOptions: { enabled: true },
  });

  forceUpdateGraphics() {
    const oldGraphics = this.sketchModel.updateGraphics.at(0);
    const index = this.sketchModel.layer.graphics.findIndex(
      (g) => g === oldGraphics
    );
    this.sketchModel.layer.graphics = this.sketchModel.layer.graphics.clone();
    if (index == -1) return;
    const newGraphics = this.sketchModel.layer.graphics.at(index);
    this.sketchModel.update(newGraphics);
  }

  updateMapper: {
    [key in __esri.SketchViewModelUpdateEvent['state']]: (
      event: __esri.SketchViewModelUpdateEvent
    ) => void;
  } = {
    start: (event) => {
      const graphic = event.graphics[0];
      if (graphic.symbol instanceof FillSymbol) {
        this.simpleFillSymbol.outline.width = graphic.symbol.outline.width;
        this.simpleFillSymbol.outline.color = graphic.symbol.outline.color;
        this.simpleFillSymbol.color = graphic.symbol.color;
      }

      if (graphic.symbol instanceof TextSymbol) {
        this.textSymbol.text = graphic.symbol.text;
        this.textSymbol.font.size = graphic.symbol.font.size;
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
      this.forceUpdateGraphics();
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

  sandToBack() {
    const graphic = this.sketchModel.updateGraphics.at(0);
    this.sketchModel.layer.graphics.remove(graphic);
    this.sketchModel.layer.graphics.unshift(graphic);
    this.sketchModel.cancel();
  }

  create(tool: Tool) {
    if (this.activeTool() == tool) return this.sketchModel.cancel();

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
      case 'text':
        this.sketchModel.pointSymbol = this.textSymbol;
        this.sketchModel.create('point');
        break;
      case 'icon':
        this.sketchModel.pointSymbol = CIMPoint;
        this.sketchModel.create('point');
        break;
      default:
        break;
    }
  }

  private get outlines() {
    const result: LineSymbol[] = [this.simpleFillSymbol.outline];
    for (const graphic of this.sketchModel.updateGraphics)
      if (graphic.symbol instanceof FillSymbol)
        result.push(graphic.symbol.outline);
    return result;
  }

  private get fills() {
    const result: FillSymbol[] = [this.simpleFillSymbol];
    for (const graphic of this.sketchModel.updateGraphics)
      if (graphic.symbol instanceof FillSymbol) result.push(graphic.symbol);
    return result;
  }

  get fillColor() {
    return this.sketchModel.polygonSymbol.color;
  }

  set fillColor(color: Color) {
    this.fills.forEach((symbol) => {
      symbol.color.r = color.r;
      symbol.color.g = color.g;
      symbol.color.b = color.b;
    });
    this.forceUpdateGraphics();
  }

  get fillOpacity() {
    return this.simpleFillSymbol.color.a;
  }

  set fillOpacity(opacity: number) {
    this.fills.forEach((symbol) => {
      symbol.color.a = opacity;
    });
    this.forceUpdateGraphics();
  }

  get outlineColor() {
    return this.simpleFillSymbol.outline.color;
  }

  set outlineColor(color: Color) {
    this.outlines.forEach((symbol) => {
      symbol.color.r = color.r;
      symbol.color.g = color.g;
      symbol.color.b = color.b;
    });
    this.forceUpdateGraphics();
  }

  get outlineOpacity() {
    return this.sketchModel.polylineSymbol.color.a;
  }

  set outlineOpacity(opacity: number) {
    this.outlines.forEach((symbol) => {
      symbol.color.a = opacity;
    });
    this.forceUpdateGraphics();
  }

  set width(width: number) {
    this.outlines.forEach((symbol) => {
      symbol.width = width;
    });
    this.forceUpdateGraphics();
  }

  get width() {
    return this.simpleFillSymbol.outline.width;
  }

  /// # Text

  get text() {
    return this.textSymbol.text;
  }

  set text(text: string) {
    this.textSymbol.text = text;
    for (const graphic of this.sketchModel.updateGraphics)
      if (graphic.symbol instanceof TextSymbol) graphic.symbol.text = text;
    this.forceUpdateGraphics();
  }

  set fontSize(fontSize: number) {
    this.textSymbol.font.size = fontSize;
    for (const graphic of this.sketchModel.updateGraphics)
      if (graphic.symbol instanceof TextSymbol)
        graphic.symbol.font.size = fontSize;
    this.forceUpdateGraphics();
  }

  get fontSize() {
    return this.textSymbol.font.size;
  }

  get textColor() {
    return this.textSymbol.color;
  }

  set textColor(color: Color) {
    this.textSymbol.color = color;
    for (const graphic of this.sketchModel.updateGraphics)
      if (graphic.symbol instanceof TextSymbol) graphic.symbol.color = color;
    this.forceUpdateGraphics();
  }

  /// # line

  set lineColor(color: Color) {
    setLineColor(CIMLine, color);
    for (const graphic of this.sketchModel.updateGraphics)
      if (
        graphic.symbol instanceof CIMSymbol &&
        graphic.symbol.data.symbol?.type == 'CIMLineSymbol'
      )
        setLineColor(graphic.symbol, color);
    this.forceUpdateGraphics();
  }

  set lineStroke(strokeOption: StrokeOption) {
    setLineStroke(CIMLine, strokeOption);
    for (const graphic of this.sketchModel.updateGraphics)
      if (
        graphic.symbol instanceof CIMSymbol &&
        graphic.symbol.data.symbol?.type == 'CIMLineSymbol'
      )
        setLineStroke(graphic.symbol, strokeOption);
    this.forceUpdateGraphics();
  }

  set lineSize(size: number) {
    setLineSize(CIMLine, size);
    for (const graphic of this.sketchModel.updateGraphics)
      if (
        graphic.symbol instanceof CIMSymbol &&
        graphic.symbol.data.symbol?.type == 'CIMLineSymbol'
      )
        setLineSize(graphic.symbol, size);
    this.forceUpdateGraphics();
  }

  // # point
  set iconUrl(url: string) {
    setPointIcon(CIMPoint, { url });
  }

  set iconText(text: string) {
    setPointText(CIMPoint, { text });
    for (const graphic of this.sketchModel.updateGraphics)
      if (
        graphic.symbol instanceof CIMSymbol &&
        graphic.symbol.data.symbol?.type == 'CIMPointSymbol'
      )
        setPointText(graphic.symbol, { text });

    this.forceUpdateGraphics();
  }
}
