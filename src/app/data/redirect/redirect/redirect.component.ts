import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css'
})
export class RedirectComponent {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    else {
      const userData = this.authService.obtenerDatosUsuario();
      if (userData?.role === 'superadmin') {
        this.router.navigate(['/sa']);
        return;
      } 
      else if (userData?.role === 'admin' || userData?.role === 'operator') {
        this.router.navigate(['/home']);
        return;
      } 
      else {
        this.router.navigate(['/auth/login']);
      }
    } 
  } 
}
