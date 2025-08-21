import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SubsectorService } from '../../../../data/services/subsector.service';
import { EstadosNavegacionService } from '../../../../data/services/estados-navegacion.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../layout/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../../../../layout/edit-dialog/edit-dialog.component';
import { Validators } from '@angular/forms';
import { ToastService } from '../../../../data/services/toast.service';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../../../data/services/auth.service';

@Component({
  selector: 'app-subsectors',
  imports: [ReactiveFormsModule, FormsModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './subsectors.component.html',
  styleUrl: './subsectors.component.css'
})
export class SubsectorsComponent {
  idLocacion!: any | null;
  subsectors: any[] = [];
  originalSubsectors: any[] = [];
  idSector: any | null;
  filtro: string = '';
  searchControl = new FormControl('');
  searchSuscription!: Subscription;
  isLoading: boolean = false;
  datosUsuario: any;
  status: boolean = true; // Variable para controlar el estado de los sectores (activos/inactivos)

  constructor(private authService: AuthService, private dialog: MatDialog, private route: ActivatedRoute, private subSectorService: SubsectorService, private estadoNavegacionService: EstadosNavegacionService, private router: Router, private toastService: ToastService) {}

  ngOnInit() {
    console.clear();

    this.datosUsuario = this.authService.obtenerDatosUsuario();

    this.route.paramMap.subscribe(params => {
      this.idSector = params.get('id');
      console.log("ID MAPEADO " + this.idSector);
    })

    this.idLocacion = this.estadoNavegacionService.getLocationId(); ///aca se obtiene el id de la anterior para poder volver a la pagina de sectores
    this.estadoNavegacionService.setSectorId(this.idSector)

    this.obtenerSubSectores(this.idSector);

            this.searchControl.valueChanges.pipe(
              debounceTime(300), 
              distinctUntilChanged(),
              map(value => {
                const termino = value?.trim().toLowerCase() || '';
                if (!termino) {
                  this.subsectors = [...this.originalSubsectors]; 
                }
                console.log(termino);
                this.subsectors = this.originalSubsectors.filter(s => s.name.toLowerCase().includes(termino));
              })
            ).subscribe();

}

  obtenerSubSectores(id: number) {
    this.isLoading = true;
    this.subSectorService.ObtenerSubsectores(id, Number(this.authService.obtenerIdEmpresa()), this.status).subscribe({
      next: (data) => {
        console.log(data);
        this.originalSubsectors = data;
        this.subsectors = [...data];
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

  navegarActivos(id: number){
    this.router.navigate(['/asset-management/assets/' + id]);
  }

  editarSubSector(id: number, name: string, tagRfid: string) {
    this.dialog.open(EditDialogComponent, {
      data: {
        title: 'Editar Subsector',
        fields: [
          {
            name: 'name',
            label: 'Nombre del subsector',
            value: name,
            validators: [Validators.required, Validators.minLength(3)]
          }
        ]
      },
      width: '400px',
      panelClass: 'custom-dialog-container'
    }).afterClosed().subscribe(result => {
      if (result) {
        const locationData = {
          id: id,
          name: result.name
        }
        console.log(result)
        console.log(locationData);
        this.subSectorService.EditarSubsector(locationData).subscribe({
          next: (data: any) => {
            console.log(data);
            this.ngOnInit();
            this.toastService.showSuccess(data.mensaje);
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
    }); 
  }

  eliminarSubSectorConConfirmacion(id: number, name: string) {
    if (this.status) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirmar Baja de Subsector",
          message: `¿Estás seguro de que deseas dar de baja el Subsector "${name}"? Esto también dara de baja todos los activos asociados, podras recuperarlos si lo necesitas.`,
          input: "Dar de Baja"
        }      
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.eliminarSubSector(id);
        }
      });

    }
    else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirmar Alta de Subsector",
          message: `¿Estás seguro de que deseas dar de alta el Subsector "${name}"? Esto también dara de alta todos los activos asociados.`,
          input: "Dar de Alta"
        }      
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.eliminarSubSector(id);
        }
      });

    }
  }

  eliminarSubSector(id: number) {
    this.subSectorService.EliminarSubsector(id).subscribe({
      next: (data) => {
        console.log(data);
        this.ngOnInit();
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

  OrdenarSubSectores(orden: string) {
    if (!orden) return;
    this.isLoading = true;

    if (orden == 'sin' || orden == 'sin_filtro' || orden == '') {
      this.status = true; 
      this.obtenerSubSectores(this.idSector);
      console.log("Reseteando filtros");
      return;
    }

    if (orden == 'baja') {
      this.status = false;
      this.obtenerSubSectores(this.idSector);
      console.log("Locaciones inactivas");
      return;
    }
    
    const filtro = [...this.subsectors].sort((a, b) => {
      const NombreA = a.name.toLowerCase();
      const NombreB = b.name.toLowerCase();

      if (orden === 'asc') {
        return NombreA.localeCompare(NombreB);
      }
      else {
        return NombreB.localeCompare(NombreA);
      }
    });

    this.subsectors = filtro;
    this.isLoading = false;
  }
}
