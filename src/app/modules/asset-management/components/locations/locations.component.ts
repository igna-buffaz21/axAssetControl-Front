import { Component } from '@angular/core';
import { SkeletonComponent } from "../../../../layout/skeleton/skeleton/skeleton.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { LocationService } from '../../../../data/services/location.service';
import { AuthService } from '../../../../data/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../layout/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../../../../layout/edit-dialog/edit-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from '../../../../data/services/toast.service';
import { debounceTime, distinctUntilChanged, Subscription, switchMap, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-locations',
  imports: [MatProgressSpinnerModule, FormsModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, ReactiveFormsModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent {
  locations!: any[]
  originalLocations!: any[];
  datosUsuario!: any;
  companyId!: any;
  searchControl = new FormControl('');
  searchSuscription!: Subscription;
  filtro: string = "";
  isLoading = false;
  status: boolean = true; // Variable para controlar el estado de las locaciones (activas/inactivas)

  constructor(private locationService: LocationService, private authService: AuthService, private router: Router, private dialog: MatDialog, private toastService: ToastService) {}

  ngOnInit() {
    console.clear();
    this.datosUsuario = this.authService.obtenerDatosUsuario();
    this.companyId = this.datosUsuario.companyId;
    
    this.ObtenerLocaciones(this.companyId, this.status);

    this.searchControl.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      tap(value => {
        const termino = value?.trim().toLowerCase() || '';
        if (!termino) {
          this.locations = [...this.originalLocations]; // Si el campo de búsqueda está vacío, mostrar todas las locaciones
        }
        console.log(termino);
        this.locations = this.originalLocations.filter(l => l.name.toLowerCase().includes(termino));
      })
    ).subscribe();
  }

  ObtenerLocaciones(idCompany: number, status: boolean) {
    this.isLoading = true;
    this.locationService.getLocations(idCompany, this.status).subscribe({
      next: (data) => {
        console.log(data);
        this.originalLocations = data;
        this.locations = [...data]; ///esto hace una copia modificable del array original sin modificar el original a la hora de hacer cambios
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

  navegarASectores(id: number) {
    console.log(id);
    this.router.navigate(['/asset-management/sector/' + id]);
  }

  editarLocacion(id: number, name: string) {
    this.dialog.open(EditDialogComponent, {
      data: {
        title: 'Editar Locación',
        fields: [
          {
            name: 'name',
            label: 'Nombre de la locación',
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
        this.locationService.EditarLocacion(locationData).subscribe({
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

  eliminarLocacionConConfirmacion(id: number, name: string) {
    if (this.status) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirmar Baja de Locación",
          message: `¿Estás seguro de que deseas dar de baja la locación "${name}"? Esto también dara de baja todos los sectores, subsectores y activos asociados, podras recuperarlos si lo necesitas.`,
          input: "Dar de Baja"
        }      
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.eliminarLocacion(id);
        }
      });

    }
    else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirmar Alta de Locación",
          message: `¿Estás seguro de que deseas dar de alta la locación "${name}"? Esto también dara de alta todos los sectores, subsectores y activos asociados.`,
          input: "Dar de Alta"
        }      
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.eliminarLocacion(id);
        }
      });

    }
  }

  eliminarLocacion(id: number) {
    this.locationService.EliminarLocacion(id).subscribe({
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

  OrdenarLocaciones(orden: string) {
    if (!orden) return;

    console.log(orden);

    this.isLoading = true;

      if (orden == 'sin' || orden == 'sin_filtro' || orden == '') {
        this.status = true; 
        this.ObtenerLocaciones(this.companyId, this.status); 
        console.log("Reseteando filtros");
        return;
      }

      if (orden == 'baja') {
        this.status = false;
        this.ObtenerLocaciones(this.companyId, this.status);
        console.log("Locaciones inactivas");
        return;
      }
    
    const filtro = [...this.locations].sort((a, b) => {
      const NombreA = a.name.toLowerCase();
      const NombreB = b.name.toLowerCase();

      if (orden == 'asc') {
        console.log("asc");
        return NombreA.localeCompare(NombreB);
      }
      else if (orden == 'desc') {
        console.log("desc");
        return NombreB.localeCompare(NombreA);
      }
    });

    this.locations = filtro;
    this.isLoading = false;
  }
}
