import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../layout/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../../../layout/edit-dialog/edit-dialog.component';
import { Validators } from '@angular/forms';
import { ToastService } from '../../../data/services/toast.service';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subscription, switchMap } from 'rxjs';
import { CompanyService } from '../../../data/services/company.service';
import { Company } from '../../../data/interfaces/company.interfaz';

@Component({
  selector: 'app-companys-management',
  imports: [ReactiveFormsModule, FormsModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './companys-management.component.html',
  styleUrl: './companys-management.component.css'
})
export class CompanysManagementComponent {
  filtro: string = '';
  searchControl = new FormControl('');
  searchSuscription!: Subscription;
  isLoading: boolean = false;
  originalCompanys: Company[] = [];
  companys!: Company[];
  mostrarInactivos: boolean = false;
  orden!: string; // 'asc' para ascendente, 'desc' para descendente

  constructor(private companyService: CompanyService, private dialog: MatDialog, private toastService: ToastService) {

  }

  ngOnInit() {
    this.ObtenerEmpresas();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        const termino = value?.trim().toLowerCase() || '';
        if (!termino) {
          this.companys = [...this.originalCompanys];
        }
        console.log(termino);
        this.companys = this.originalCompanys.filter(s => s.name.toLowerCase().includes(termino));
      })
    ).subscribe()
  }

  ObtenerEmpresas() {
    this.companyService.ObtenerTodasLasEmpresas(this.mostrarInactivos).subscribe({
      next: (data) => {
        console.log(data);
        this.originalCompanys = data;
        this.companys = [...this.originalCompanys];
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

  OrdenarEmpresas(orden: string) {
    if (!orden) return;
    this.isLoading = true;
    
    const filtro = [...this.companys].sort((a, b) => {
      const NombreA = a.name.toLowerCase();
      const NombreB = b.name.toLowerCase();

      if (orden === 'asc') {
        return NombreA.localeCompare(NombreB);
      }
      else {
        return NombreB.localeCompare(NombreA);
      }
    });

    this.companys = filtro;
    this.isLoading = false;
  }

  editarCompany(id: number, name: string) {
    this.dialog.open(EditDialogComponent, {
      data: {
        title: 'Editar Empresa',
        fields: [
          {
            name: 'name',
            label: 'Nombre de la empresa',
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
        this.companyService.EditarEmpresa(locationData).subscribe({
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

  AltaBajaEmpresaConConfirmacion(id: number, name: string, status: boolean) {
    if (this.mostrarInactivos) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { 
          title: 'Activar Empresa',
          message: `¿Deseás dar de alta a la empresa "${name}"? Todos sus usuarios volveran a tener acceso.`,
          input: "Activar Empresa"
        }  
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.darDeAltaBajaEmpresa(id, status);
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { 
          title: 'Desactivar Empresa',
          message: `¿Deseás dar de baja a la empresa "${name}"? Todos sus usuarios quedarán sin acceso. Podrás reactivarla cuando lo necesites.`,
          input: "Desactivar Empresa"
        }  
        
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.darDeAltaBajaEmpresa(id, status);
        }
      });
    }


  }

  darDeAltaBajaEmpresa(id: number, status: boolean) {
    console.log("STATUS " + status);
    this.companyService.AltaBajaEmpresa(id, status).subscribe({
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
  
  cambiarStatus() {
    this.mostrarInactivos = !this.mostrarInactivos
    this.ObtenerEmpresas();
  }
}
