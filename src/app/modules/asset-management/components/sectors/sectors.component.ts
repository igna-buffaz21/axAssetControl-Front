import { Component, input } from '@angular/core';
import { SkeletonComponent } from '../../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SectorService } from '../../../../data/services/sector.service';
import { EstadosNavegacionService } from '../../../../data/services/estados-navegacion.service';
import { ConfirmDialogComponent } from '../../../../layout/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../../../layout/edit-dialog/edit-dialog.component';
import { Validators } from '@angular/forms';
import { ToastService } from '../../../../data/services/toast.service';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../../../data/services/auth.service';


@Component({
  selector: 'app-sectors',
  imports: [ReactiveFormsModule, FormsModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './sectors.component.html',
  styleUrl: './sectors.component.css'
})
export class SectorsComponent {
  idLocacion!: any | null;
  sectores: any[] = [];
  originalSectores: any[] = [];
  filtro: string = "";
  isLoading = false;
  searchControl = new FormControl('');
  searchSuscription!: Subscription;
  datosUsuario: any
  status: boolean = true; // Variable para controlar el estado de los sectores (activos/inactivos)

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private sectorService: SectorService, private router: Router, private estadoNavegacionService: EstadosNavegacionService, private toastService: ToastService, private authService: AuthService) {}

  ngOnInit() {
    console.clear();

    this.datosUsuario = this.authService.obtenerDatosUsuario();

    this.route.paramMap.subscribe(params => {
      this.idLocacion = params.get('id');
      console.log("ID MAPEADO " + this.idLocacion);
    })

    this.estadoNavegacionService.setLocationId(this.idLocacion); ///aca se guarda el id del sector para poder volver a la pagina de sectores

    this.ObtenerSectores(this.idLocacion, Number(this.authService.obtenerIdEmpresa()), this.status);

        this.searchControl.valueChanges.pipe(
          debounceTime(300), 
          distinctUntilChanged(),
          map( value => {
            const termino = value?.trim().toLowerCase() || '';
            if (!termino) {
              this.sectores = [...this.originalSectores]; 
            }
            console.log(termino);
            this.sectores = this.originalSectores.filter(s => s.name.toLowerCase().includes(termino));
          })
        ).subscribe();
  }

  ObtenerSectores(id: number, idEmpresa: number, status: boolean) {
    this.isLoading = true;
    this.sectorService.ObtenerSectores(id, idEmpresa, status).subscribe({
      next: (data) => {
        console.log(data);
        this.originalSectores = data;
        this.sectores = [...data] 
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

  navegarASubsectores(id: number) {
    console.log(id);
    this.router.navigate(['/asset-management/subsector/' + id]);
  }

  editarSector(id: number, name: string) {
    this.dialog.open(EditDialogComponent, {
      data: {
        title: 'Editar Sector',
        fields: [
          {
            name: 'name',
            label: 'Nombre del sector',
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
          name: result.name,
        }
        console.log(result)
        console.log(locationData);
        this.sectorService.EditarSector(locationData).subscribe({
          next: (data) => {
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

    eliminarSectorConConfirmacion(id: number, name: string) {
      if (this.status) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: "Confirmar Baja de Sector",
            message: `¿Estás seguro de que deseas dar de baja el sector "${name}"? Esto también dara de baja todos los subsectores y activos asociados, podras recuperarlos si lo necesitas.`,
            input: "Dar de Baja"
          }      
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.eliminarSector(id);
          }
        });
  
      }
      else {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: "Confirmar Alta de Sector",
            message: `¿Estás seguro de que deseas dar de alta el sector "${name}"? Esto también dara de alta todos los subsectores y activos asociados.`,
            input: "Dar de Alta"
          }      
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.eliminarSector(id);
          }
        });
  
      }
    }

  eliminarSector(id: number) {
    this.sectorService.EliminarSector(id).subscribe({
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

  OrdenarSectores(orden: string) {
    if (!orden) return;
    this.isLoading = true;

    if (orden == 'sin' || orden == 'sin_filtro' || orden == '') {
      this.status = true; 
      this.ObtenerSectores(this.idLocacion, Number(this.authService.obtenerIdEmpresa()), this.status);
      console.log("Reseteando filtros");
      return;
    }

    if (orden == 'baja') {
      this.status = false;
      this.ObtenerSectores(this.idLocacion, Number(this.authService.obtenerIdEmpresa()), this.status);
      console.log("Locaciones inactivas");
      return;
    }
    
    const filtro = [...this.sectores].sort((a, b) => {
      const NombreA = a.name.toLowerCase();
      const NombreB = b.name.toLowerCase();

      if (orden === 'asc') {
        return NombreA.localeCompare(NombreB);
      }
      else {
        return NombreB.localeCompare(NombreA);
      }
    });

    this.sectores = filtro;
    this.isLoading = false;
  }
}
