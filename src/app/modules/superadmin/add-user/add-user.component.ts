import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../data/services/user.service';
import { AuthService } from '../../../data/services/auth.service';
import { ToastService } from '../../../data/services/toast.service';
import { CompanyService } from '../../../data/services/company.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-user',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  locationForm: FormGroup;
  empresas!: any[];
  isLoading = false;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private toastService: ToastService, private companyService: CompanyService) {  
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      empresaId: ['', [Validators.required, Validators.minLength(1)]]
      });
  }

  ngOnInit() {
    this.ObtenerEmpresas();
  }

  ObtenerEmpresas() {
    this.companyService.ObtenerTodasLasEmpresas(false).subscribe({
      next: (data) => {
        this.empresas = data;
        console.log(data)
      },
      error: (e) => {
        if (e.status == 400) {
          this.toastService.showError(e.error.mensaje);
        }
        else if (e.status == 500) {
          this.toastService.showError(e.error.mensaje);
        }
        else if (e.status == 403) {
          this.toastService.showError('No tienes permisos para realizar esta acción.');
        }
        else {
          this.toastService.showError('Error desconocido, intentelo más tarde.');
          console.log(e);
        }
      }
    })
  }

  CrearUsuario() {
    this.isLoading = true;
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      const data = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        idCompany: formData.empresaId,
        rol: "admin",
        status: "actived"
      }
      this.userService.CrearUsuario(data).subscribe({
        next: (data) => {
          console.log(data)
          this.toastService.showSuccess(data.mensaje)
          this.locationForm.reset();
          this.isLoading = false;
        },
        error: (e) => {
          if (e.status == 400) {
            this.toastService.showError(e.error.mensaje);
            this.isLoading = false;
          }
          else if (e.status == 500) {
            this.toastService.showError(e.error.mensaje);
            this.isLoading = false;
          }
          else {
            this.toastService.showError("Error desconocido, intentelo mas tarde!")
            console.log(e);
            this.isLoading = false;
          }
        }
      })
    }
  }

}