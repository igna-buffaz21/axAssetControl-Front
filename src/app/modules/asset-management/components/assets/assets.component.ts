import { Component, input } from '@angular/core';
import { SkeletonComponent } from '../../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EstadosNavegacionService } from '../../../../data/services/estados-navegacion.service';
import { AssetService } from '../../../../data/services/asset.service';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-assets',
  imports: [ReactiveFormsModule, FormsModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css'
})
export class AssetsComponent {
  sectorId!: any | null; ///id del sector al que pertenece el subsector
  subSectorId!: any | null; ///id del subsector al que pertenece el activo
  assets: any[] = [];
  originalAssets: any[] = [];
  idSubSector: any | null; ///id del subsector al que pertenece el activo
  filtro: string = '';
  searchControl = new FormControl('');
  searchSuscription!: Subscription;
  isLoading: boolean = false;
  datosUsuario: any;
  status: boolean = true; ///variable para saber si el subsector esta activo o no

  constructor(private authService: AuthService,private route: ActivatedRoute, private estadoNavegacionService: EstadosNavegacionService, private assetService: AssetService, private dialog: MatDialog, private toastService: ToastService) {}

  ngOnInit() {
    console.clear();

    this.datosUsuario = this.authService.obtenerDatosUsuario();

    this.route.paramMap.subscribe(params => {
      this.subSectorId = params.get('id');
      console.log("ID MAPEADO " + this.subSectorId);
    })

    this.sectorId = this.estadoNavegacionService.getSectorId(); ///aca se obtiene el id de la anterior para poder volver a la pagina de sectores
    this.idSubSector = this.estadoNavegacionService.setSubSectorId(this.subSectorId); ///aca se guarda el id del subsector en el localStorage para poder volver a la pagina de activos

    this.ObtenerActivos(this.idSubSector);

    this.searchControl.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      map(value => {
        const termino = value?.trim().toLowerCase() || '';
        if (!termino) {
          this.assets = [...this.originalAssets]; // Si el término de búsqueda está vacío, restaurar la lista original
        }
        console.log(termino);
        this.assets = this.originalAssets.filter(a => a.name.toLowerCase().includes(termino));  
      })
    ).subscribe();

  }

  ObtenerActivos(id: number) {
    this.isLoading = true;
    this.assetService.ObtenerActivos(this.subSectorId, Number(this.authService.obtenerIdEmpresa()), this.status).subscribe({
      next: (data) => {
        console.log(data);
        this.originalAssets = data; 
        this.assets = [...data];
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

  eliminarActivoConConfirmacion(id: number, name: string) {
    if (this.status) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirmar Baja del Activo",
          message: `¿Estás seguro de que deseas dar de baja el activo "${name}"? podras recuperarlo si lo necesitas.`,
          input: "Dar de Baja"
        }      
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.EliminarActivo(id);
        }
      });

    }
    else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirmar Alta del Activo",
          message: `¿Estás seguro de que deseas dar de alta el activo "${name}"?`,
          input: "Dar de Alta"
        }      
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.EliminarActivo(id);
        }
      });

    }
  }

  EliminarActivo(id: number) {
    this.assetService.EliminarActivo(id).subscribe({
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

  editarActivo(id: number, name: string, brand: string, model: string, seriaNumber: string, tagRfid: string, idActiveType: number) {
    this.dialog.open(EditDialogComponent, {
      data: {
        title: 'Editar Activo',
        fields: [
          {
            name: 'name',
            label: 'Nombre del activo',
            value: name,
            validators: [Validators.required, Validators.minLength(3)]
          },
          {
            name: 'brand',
            label: 'Marca del activo',
            value: brand,
            validators: [Validators.required, Validators.minLength(3)]
          },
          {
            name: 'model',
            label: 'Modelo del activo',
            value: model,
            validators: [Validators.required, Validators.minLength(3)]
          },
          {
            name: 'seriaNumber',
            label: 'Numero de serie del activo',
            value: seriaNumber,
            validators: [Validators.required, Validators.minLength(3)]
          },
          {
            name: 'idActiveType',
            label: 'Tipo de activo',
            value: idActiveType,
            validators: [Validators.required, Validators.minLength(1)]
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
          brand: result.brand,
          model: result.model,
          seriaNumber: result.seriaNumber,
          tagRfid: result.tagRfid,
          idActiveType: result.idActiveType
        }
        console.log(result)
        console.log(locationData);
        this.assetService.EditarActivo(locationData).subscribe({
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

  OrdenarActivos(orden: string) {
    if (!orden) return;
    this.isLoading = true;

    if (orden == 'sin' || orden == 'sin_filtro' || orden == '') {
      this.status = true; 
      this.ObtenerActivos(this.idSubSector);
      console.log("Reseteando filtros");
      return;
    }

    if (orden == 'baja') {
      this.status = false;
      this.ObtenerActivos(this.idSubSector);
      console.log("Locaciones inactivas");
      return;
    }
    
    const filtro = [...this.assets].sort((a, b) => {
      const NombreA = a.name.toLowerCase();
      const NombreB = b.name.toLowerCase();

      if (orden === 'asc') {
        return NombreA.localeCompare(NombreB);
      }
      else {
        return NombreB.localeCompare(NombreA);
      }
    });

    this.assets = filtro;
    this.isLoading = false;
  }
}
