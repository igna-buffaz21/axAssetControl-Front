import { Component } from '@angular/core';
import { SkeletonComponent } from "../../../layout/skeleton/skeleton/skeleton.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [SkeletonComponent, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}
