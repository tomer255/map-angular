import {
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView.js';
import Basemap from '@arcgis/core/Basemap';

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content />',
  styleUrl: './map.component.css',
  schemas: [],
  encapsulation: ViewEncapsulation.None,
})
export class LibMapComponent implements OnInit {
  viewClick = output<__esri.ViewClickEvent>();
  elementRef = inject(ElementRef);

  map = new Map({
    basemap: new Basemap(),
  });

  view = new MapView({
    map: this.map, // References a Map instance
    center: [34.89, 31.77],
    zoom: 7,
    ui: { components: [] },
    container: this.elementRef.nativeElement,
  });

  ngOnInit(): void {
    this.view.on('click', (e) => this.viewClick.emit(e));
  }
}
