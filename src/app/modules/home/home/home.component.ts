import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../data/services/user.service';
import { AuthService } from '../../../data/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatDividerModule, RouterModule, SkeletonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user: any;
  userId: any;
  companyId: any;

  constructor(private userService:UserService, private authService: AuthService, private router : Router) {}

  ngOnInit() {
    console.clear();
    this.user = this.authService.obtenerDatosUsuario();
    this.userId = this.user.id;
    this.companyId = this.user.companyId;
    console.log(this.user);
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
