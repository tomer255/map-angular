import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapComponent } from '@map-angular/map-ui';

@Component({
  standalone: true,
  imports: [RouterModule, MapComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
