import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-skeleton',
  imports: [
    NavbarComponent,
    MatSidenavModule
  ],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css'
})
export class SkeletonComponent {

  constructor() {}
}
