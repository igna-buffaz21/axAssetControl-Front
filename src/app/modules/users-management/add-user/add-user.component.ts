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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-user',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  locationForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private toastService: ToastService) {  
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      rol: ['', [Validators.required, Validators.minLength(1)]],
    });

  }


    CrearUsuario() {
      this.isLoading = true;
      const UserData = this.locationForm.value;
      UserData.idCompany = Number(this.authService.obtenerIdEmpresa());
      UserData.status = 'actived';
      console.log(UserData);

      this.userService.CrearUsuario(UserData).subscribe({
        next: (data) => {
          this.toastService.showSuccess(data.mensaje);
          console.log(data);
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
            console.log(e);
          }
          else if (e.status == 403) {
            this.toastService.showError("No tienes permisos para realizar esta acción");
            this.isLoading = false;
          }
          else {
            this.toastService.showError("Error desconocido, intente más tarde");
            this.isLoading = false;
            console.log(e);
          }
        }
      })
    }


}
