import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { ControlRecordService } from '../../../data/services/control-record.service';
import { AuthService } from '../../../data/services/auth.service';
import { ControlRecordDTO, DetailControlDTO } from '../../../data/interfaces/detailControl.interfaz';
import { ToastService } from '../../../data/services/toast.service';
import { debounceTime, distinctUntilChanged, map, of, Subscription, switchMap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-missing-assets',
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, MatMenuModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './missing-assets.component.html',
  styleUrl: './missing-assets.component.css'
})
export class MissingAssetsComponent {

  constructor(private controlRecordService: ControlRecordService, private authService: AuthService, private toastService: ToastService) {}

    // Para los selectores
    locations: any[] = [];
    sectors: any[] = [];
    subsectors: any[] = [];
    selectedLocation: any;
    selectedSector: any;
    selectedSubsector: any;
    idCompany: any;
    detailControl!: DetailControlDTO[];
    originalDetailControl!: DetailControlDTO[];
    controles!: ControlRecordDTO[];
    originalcontroles!: ControlRecordDTO[];
    isLoading: boolean = false;
    filtro: string = '';
    searchControl = new FormControl('');

    ngOnInit() {
      this.idCompany = this.authService.obtenerIdEmpresa()

      this.ObtenerActivosPerdidos(this.idCompany);


      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(value => {
          const termino = value?.trim().toLowerCase() || '';
          if (!termino) return [...this.originalcontroles];
      
          // Filtrar controles y dentro de ellos filtrar los detalles
          return this.originalcontroles
            .map(control => {
              const detallesFiltrados = control.detailControls.filter(dc => {
                const nombre = dc.idActivoNavigation?.name?.toLowerCase() || '';
                return nombre.includes(termino);
              });
      
              if (detallesFiltrados.length === 0) return null;
      
              return {
                ...control,
                detailControls: detallesFiltrados
              };
            })
            .filter(control => control !== null);
        })
      ).subscribe(resultado => {
        this.controles = resultado;
      });
      
      
    }

    ObtenerActivosPerdidos(id: number) {
      this.isLoading = true;
      this.controlRecordService.ObtenerControlUPCSAP(id).subscribe({
        next: (data: ControlRecordDTO[]) => {
          this.originalcontroles = data;
          this.controles = [...this.originalcontroles]; // Copia de seguridad de los datos originales
          console.log(this.controles);
          this.isLoading = false;
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
          this.isLoading = false;
        }
      })
    }

    OrdenarControles(filtro: string) {
      if (!filtro) return;
    
      this.isLoading = true;
    
      const [campo, orden] = filtro.split('-');
      const copia = [...this.originalcontroles]; // Clonamos los controles originales
    
      let sorted: ControlRecordDTO[];
    
      if (campo === 'subsector') {
        sorted = copia.sort((a, b) => {
          const nameA = a.idSubsectorNavigation.name.toLowerCase();
          const nameB = b.idSubsectorNavigation.name.toLowerCase();
          return orden === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
      } else {
        // Para orden por activo o auditor, ordenar por el primer detailControl (opcional: mejorar esto)
        sorted = copia.map(control => ({
          ...control,
          detailControls: [...control.detailControls].sort((a, b) => {
            let valA = '';
            let valB = '';
    
            if (campo === 'activo') {
              valA = a.idActivoNavigation.name.toLowerCase();
              valB = b.idActivoNavigation.name.toLowerCase();
            } else if (campo === 'auditor') {
              valA = a.idAuditorNavigation.name.toLowerCase();
              valB = b.idAuditorNavigation.name.toLowerCase();
            }
    
            return orden === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          })
        }));
      }
    
      this.controles = sorted;
      this.isLoading = false;
    }
    
    
}
