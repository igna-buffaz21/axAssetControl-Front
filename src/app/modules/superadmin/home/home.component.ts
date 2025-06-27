import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../data/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, SkeletonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private authService: AuthService) {}

  logOut() {
    this.authService.Logout();
  }
}
