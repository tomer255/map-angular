import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMapComponent } from './map/map.component';

@Component({
  standalone: true,
  imports: [RouterModule, AppMapComponent, AppMapComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
