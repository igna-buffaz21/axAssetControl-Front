import { Component, HostListener } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../data/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  rol!: string;
  mobileMenuOpen: boolean = false;


  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.rol = this.authService.obtenerDatosUsuario()?.role
    console.log(this.rol);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Cerrar menú al hacer scroll
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

}
