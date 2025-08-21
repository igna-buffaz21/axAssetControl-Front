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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgFor } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-subsector',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule, MatAutocompleteModule, MatSelectModule, AsyncPipe, NgFor],
  templateUrl: './add-subsector.component.html',
  styleUrl: './add-subsector.component.css'
})
export class AddSubsectorComponent {
  idSector: any | null = null;
  locationForm: FormGroup;

  opciones: string[] = [
    'Oficina',
    'Recepción',
    'Sala de Juntas',
    'Sala de Conferencias',
    'Sala de Capacitación',
    'Área de Recursos Humanos',
    'Área de Finanzas',
    'Área de Contabilidad',
    'Área de Ventas',
    'Área de Compras',
    'Área de Marketing',
    'Área de Atención al Cliente',
    'Depósito',
    'Almacén',
    'Bodega',
    'Área de Producción',
    'Línea de Ensamblaje',
    'Taller de Mantenimiento',
    'Laboratorio de Calidad',
    'Laboratorio de Investigación',
    'Sala de Servidores',
    'Centro de Datos',
    'Sala de Control',
    'Sala de Monitoreo',
    'Archivo Físico',
    'Sala de Archivo Digital',
    'Área de Paquetería',
    'Área de Envíos',
    'Área de Carga y Descarga',
    'Área de Embalaje',
    'Estacionamiento Interno',
    'Estacionamiento de Visitantes',
    'Cocina',
    'Comedor de Empleados',
    'Sala de Descanso',
    'Vestuario Masculino',
    'Vestuario Femenino',
    'Baños Masculinos',
    'Baños Femeninos',
    'Baños para Personas con Discapacidad',
    'Zona de Limpieza',
    'Cuarto de Basura',
    'Cuarto de Mantenimiento',
    'Zona Verde',
    'Patio Interno',
    'Terraza',
    'Pasillo Principal',
    'Pasillo Secundario',
    'Mostrador de Atención',
    'Área de Exhibición',
    'Showroom',
    'Área de Seguridad',
    'Garita de Vigilancia',
    'Zona de Carga Pesada',
    'Zona de Entrega a Clientes'
  ];
  
  opcionesFiltradas!: Observable<string[]>;

  constructor(private authService: AuthService , private fb: FormBuilder, private estadosNavegacionService: EstadosNavegacionService, private subSectorService: SubsectorService, private toastService: ToastService) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    console.clear();

    this.idSector = this.estadosNavegacionService.getSectorId();

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

  CrearSubsector() {
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      formData.idSector = this.idSector;
      formData.tagRfid = null;
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
