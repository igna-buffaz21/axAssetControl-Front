import { Component } from '@angular/core';
import { SkeletonComponent } from "../../../../layout/skeleton/skeleton/skeleton.component";
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadosNavegacionService } from '../../../../data/services/estados-navegacion.service';
import { AssetService } from '../../../../data/services/asset.service';
import { ToastService } from '../../../../data/services/toast.service';
import { AuthService } from '../../../../data/services/auth.service';

@Component({
  selector: 'app-add-asset',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-asset.component.html',
  styleUrl: './add-asset.component.css'
})
export class AddAssetComponent {
  locationForm!: FormGroup;
  idSubSector: any | null;

  constructor(private authService: AuthService,private fb: FormBuilder, private estadoNavegacionSerivice: EstadosNavegacionService, private assetService: AssetService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', [Validators.required, Validators.minLength(2)]],
      serialNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]*$')]],
      assetType: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });

    this.idSubSector = this.estadoNavegacionSerivice.getSubSectorId()
  }

  CrearActivo() {
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      const data = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        idSubsector: this.idSubSector,
        tagRfid: "1",
        idActiveType: formData.assetType,
        cantity: formData.cantity,
        idEmpresa: Number(this.authService.obtenerIdEmpresa())
      };
      this.assetService.CrearActivo(data).subscribe({
        next: (data) => {
          console.log(data);
          this.toastService.showSuccess("Activo creado correctamente");
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
      console.log('Formulario inválido');
    }
  }
}
