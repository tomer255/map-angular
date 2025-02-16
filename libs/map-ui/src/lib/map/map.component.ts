import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-zoom';
import { ArcgisMapCustomEvent } from '@arcgis/map-components';
import { MapService } from './map.service';
import Point from '@arcgis/core/geometry/Point.js';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic"

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LibMapComponent {
  mapService = inject(MapService);

  arcgisViewReadyChange(map: ArcgisMapCustomEvent<unknown>) {
    this.mapService.map.set(map);
    this.mapService.loaded.set(true);
    this.test(map)
  }

  test(map){
    const graphic = new Graphic({  // graphic with point geometry
      geometry: new Point({...}), // set geometry here
      symbol: new SimpleMarkerSymbol({...}) // set symbol here
    });
    map.target.layerViews.add

  }
}
