import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../data/services/user.service';
import { AuthService } from '../../../data/services/auth.service';
import { CompanyService } from '../../../data/services/company.service';

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
  nombreEmpresa: String = '';

  constructor(private userService:UserService, private authService: AuthService, private router : Router, private companyService: CompanyService) {}

  ngOnInit() {
    console.clear();
    this.user = this.authService.obtenerDatosUsuario();
    this.userId = this.user.id;
    this.companyId = this.user.companyId;
    console.log(this.user);
    console.log(this.companyId)
    this.obtenerNombreEmpresa()
  }

  obtenerNombreEmpresa() {
    console.log("ID de la empresa: ", this.companyId);
    this.companyService.obtenerNombreEmpresaPorId(this.companyId).subscribe({
      next: (response) => {
        this.nombreEmpresa = response.mensaje;
        console.log("Nombre de la empresa: ", response.mensaje);
      },
      error: (error) => {
        console.error("Error al obtener el nombre de la empresa: ", error);
      }
    });
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
