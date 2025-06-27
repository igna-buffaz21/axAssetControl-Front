import { Component } from '@angular/core';
import { SkeletonComponent } from "../../../../layout/skeleton/skeleton/skeleton.component";
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadosNavegacionService } from '../../../../data/services/estados-navegacion.service';
import { SectorService } from '../../../../data/services/sector.service';
import { ToastService } from '../../../../data/services/toast.service';
import { AuthService } from '../../../../data/services/auth.service';

@Component({
  selector: 'app-add-sector',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-sector.component.html',
  styleUrl: './add-sector.component.css'
})
export class AddSectorComponent {
  locationForm: FormGroup;
  idLocacion!: any | null;

  constructor( private authService: AuthService,private fb: FormBuilder, private estadoNavegacionService: EstadosNavegacionService, private sectorService: SectorService, private toastService: ToastService) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    console.clear();

    this.idLocacion = this.estadoNavegacionService.getLocationId()
  }


  CrearSector() {
    if (this.locationForm.valid) {
      const locationData = this.locationForm.value;
        locationData.idLocation = this.idLocacion;
        locationData.idEmpresa = Number(this.authService.obtenerIdEmpresa());
      console.log(locationData);
      this.sectorService.CrearSector(locationData).subscribe({
        next: (data) => {
          this.toastService.showSuccess('¡Sector creado con éxito!');
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
