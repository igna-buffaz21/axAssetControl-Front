import { Component } from '@angular/core';
import { SkeletonComponent } from "../../../../layout/skeleton/skeleton/skeleton.component";
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../../../data/services/location.service';
import { AuthService } from '../../../../data/services/auth.service';
import { ToastService } from '../../../../data/services/toast.service';

@Component({
  selector: 'app-add-location',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.css'
})
export class AddLocationComponent {
  locationForm: FormGroup;
  mensajeExito: string | null = null;

  constructor(private fb: FormBuilder, private locationService: LocationService, private authService: AuthService, private toastService: ToastService) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  CrearLocacion() {
    if (this.locationForm.valid) {
      const locationData = this.locationForm.value;
      locationData.idCompany = this.authService.obtenerDatosUsuario()?.companyId;
      console.log(locationData);
      this.locationService.CrearLocacion(locationData).subscribe({
        next: (data) => {
            this.toastService.showSuccess('¡Locación creada con éxito!');
            console.log(data);
            this.locationForm.reset();
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
    } else {
      this.toastService.showError('Formullario inválido. Por favor, completa todos los campos requeridos.');
    }
  }
}
