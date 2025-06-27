import { Component } from '@angular/core';
import { SkeletonComponent } from "../../../../layout/skeleton/skeleton/skeleton.component";
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadosNavegacionService } from '../../../../data/services/estados-navegacion.service';
import { SubsectorService } from '../../../../data/services/subsector.service';
import { ToastService } from '../../../../data/services/toast.service';
import { AuthService } from '../../../../data/services/auth.service';

@Component({
  selector: 'app-add-subsector',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-subsector.component.html',
  styleUrl: './add-subsector.component.css'
})
export class AddSubsectorComponent {
  idSector: any | null = null;
  locationForm: FormGroup;

  constructor(private authService: AuthService , private fb: FormBuilder, private estadosNavegacionService: EstadosNavegacionService, private subSectorService: SubsectorService, private toastService: ToastService) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    console.clear();

    this.idSector = this.estadosNavegacionService.getSectorId();
  }

  CrearSubsector() {
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      formData.idSector = this.idSector;
      formData.tagRfid = "1";
      formData.idEmpresa = Number(this.authService.obtenerIdEmpresa());
      console.log('Form Data:', formData);
      this.subSectorService.CrearSubsector(formData).subscribe({
        next: (data) => {
          this.toastService.showSuccess("Subsector creado correctamente");
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
    }
  }

}
