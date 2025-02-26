import { Component, Host, input, SimpleChanges } from '@angular/core';
import { sector as turfSector, Units } from '@turf/turf';
import Polygon from '@arcgis/core/geometry/Polygon';
import FillSymbol from '@arcgis/core/symbols/FillSymbol';
import { GraphicComponent } from './graphic/graphic.component';
import { Sector } from './events/event.component';
import { GraphicsLayerComponent } from './graphic/graphics-layer.component';
import { SimpleChangesTyped } from './utilities/types';

@Component({
  selector: 'sector',
  standalone: true,
  imports: [],
  template: '<ng-content />',
})
export class SectorComponent extends GraphicComponent {
  sector = input.required<Sector>();
  symbol = input.required<FillSymbol>();

  updateGraphic(sector: Sector) {
    const sectorT = turfSector(
      [sector.xCenter, sector.yCenter],
      sector.radius,
      sector.bearing1,
      sector.bearing2,
      {
        units: 'kilometers' as Units,
      }
    );
    this.graphic.geometry = new Polygon({
      spatialReference: { wkid: 4326 },
      rings: sectorT.geometry.coordinates,
    });
    this.graphic.symbol = this.symbol();
  }

  ngOnChanges(changes: SimpleChangesTyped<SectorComponent>): void {
    const { firstChange, currentValue } = changes.sector;
    this.updateGraphic(currentValue);
    if (firstChange) return this.add();
  }
}
