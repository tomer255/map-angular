import {
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from './map.service';

@Component({
  selector: 'lib-map',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content />',
  styleUrl: './map.component.css',
  schemas: [],
  providers: [MapService],
  encapsulation: ViewEncapsulation.None,
})
export class LibMapComponent implements OnInit {
  viewClick = output<__esri.ViewClickEvent>();
  elementRef = inject(ElementRef);
  mapService = inject(MapService);

  map = this.mapService.map;

  view = this.mapService.view;

  ngOnInit(): void {
    this.view.on('click', (e) => this.viewClick.emit(e));
  }
}
