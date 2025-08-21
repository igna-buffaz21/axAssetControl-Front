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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgFor } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-sector',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule, MatAutocompleteModule, MatSelectModule, AsyncPipe, NgFor],
  templateUrl: './add-sector.component.html',
  styleUrl: './add-sector.component.css'
})
export class AddSectorComponent {
  locationForm: FormGroup;
  idLocacion!: any | null;

  opciones: string[] = [
    'Planta Baja',
    'Primer Piso',
    'Segundo Piso',
    'Tercer Piso',
    'Cuarto Piso',
    'Sótano',
    'Mezanine',
    'Ala Norte',
    'Ala Sur',
    'Ala Este',
    'Ala Oeste',
    'Edificio A',
    'Edificio B',
    'Edificio C',
    'Bloque 1',
    'Bloque 2',
    'Bloque 3',
    'Zona Administrativa',
    'Zona Operativa',
    'Zona Comercial',
    'Zona de Producción',
    'Zona de Almacenamiento',
    'Zona de Carga y Descarga',
    'Zona de Estacionamiento',
    'Zona de Seguridad',
    'Zona de Mantenimiento',
    'Zona Exterior',
    'Zona Verde',
    'Zona de Servicios'
  ];
  

  opcionesFiltradas!: Observable<string[]>;


  constructor( private authService: AuthService,private fb: FormBuilder, private estadoNavegacionService: EstadosNavegacionService, private sectorService: SectorService, private toastService: ToastService) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    console.clear();

    this.idLocacion = this.estadoNavegacionService.getLocationId()

    this.opcionesFiltradas = this.locationForm.get('name')!.valueChanges.pipe(
      startWith(''),
      map(valor => this.filtrar(valor || ''))
    );
  }

  private filtrar(valor: string): string[] {
    const filtro = valor.toLowerCase();
    return this.opciones.filter(opcion =>
      opcion.toLowerCase().includes(filtro)
    );
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
