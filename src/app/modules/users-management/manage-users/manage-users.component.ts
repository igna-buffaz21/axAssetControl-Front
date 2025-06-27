import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../data/services/user.service';
import { AuthService } from '../../../data/services/auth.service';
import { ToastService } from '../../../data/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../layout/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../../../layout/edit-dialog/edit-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  imports: [SkeletonComponent, RouterModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  idCompany!: any;
  users: any = [];
  mostrarInactivos: boolean = false;
  searchControl = new FormControl('');
  private searchSubscription!: Subscription;  // Guardamos la suscripción
  obtenerDatosUsuarios: any;

  constructor(private userService: UserService, private authService: AuthService, private toastService: ToastService, private dialog: MatDialog) {}

  ngOnInit() {
    this.idCompany = this.authService.obtenerIdEmpresa();

    this.obtenerDatosUsuarios = this.authService.obtenerDatosUsuario();

    console.log("ID EMPRESA " + this.idCompany);
    this.ObtenerUsuarios(this.idCompany, this.mostrarInactivos);
    console.log(this.mostrarInactivos);

    this.searchSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(300), // espera 300ms después de que el usuario deja de escribir
      distinctUntilChanged(), // evita llamadas si el texto no cambió
      switchMap(value => {
        const termino = value?.trim();
        if (!termino) {
          return this.userService.getAllUsers(this.idCompany, this.mostrarInactivos);
        }
        return this.userService.BuscarUsuariosPorNombre(value, this.mostrarInactivos, this.idCompany)
      })
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.users = data
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe(); ///desuscripcion
    }
  }

  ObtenerUsuarios(idCompany: number, mostrarInactivos: boolean) {
    this.userService.getAllUsers(idCompany, mostrarInactivos).subscribe({
      next: (data) => {
        console.log(data);
        this.users = data;
      },
      error: (e) => {
        if (e.status == 500) {
          this.toastService.showError('Error interno del servidor, intentelo más tarde.');
          console.log(e);
        }
        else if (e.status == 400) {
          this.toastService.showError(e.error.mensaje);
        }
        else if (e.status == 403) {
          this.toastService.showError('No tienes permisos para realizar esta acción.');
        }
        else {
          this.toastService.showError('Error desconocido, intentelo más tarde.');
          console.log(e);
        }      }
    })
  }

  eliminarUsuarioConConfirmacion(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Desactivar usuario',
        message: `¿Estás seguro de que deseas dar de baja al usuario "${name}"? Esta acción desactivará su cuenta y ya no podrá acceder al sistema. Podrás reactivarlo más adelante si es necesario.`,
        input: "Desactivar usuario"
      }  
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.darDeBajaUsuario(id);
      }
    });
  }

  darDeBajaUsuario(id: number) {
    this.userService.BajaUsuario(id).subscribe({
      next: (data) => {
        console.log(data);
        this.ngOnInit();
      },
      error: (e) => {
        if (e.status == 500) {
          this.toastService.showError('Error interno del servidor, intentelo más tarde.');
          console.log(e);
        }
        else if (e.status == 400) {
          this.toastService.showError(e.error.mensaje);
        }
        else if (e.status == 403) {
          this.toastService.showError('No tienes permisos para realizar esta acción.');
        }
        else {
          this.toastService.showError('Error desconocido, intentelo más tarde.');
          console.log(e);
        }      }
    })
  }

  darDeAltaConfirmacion(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Activar usuario',
        message: `¿Estás seguro de que deseas dar de alta al usuario "${name}"? Esta acción activara su cuenta y permitira que el usuario pueda acceder al sistema.`,
        input: "Activar usuario"
      }  
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.darDeAltaUsuario(id);
      }
    });
  }

  darDeAltaUsuario(id: number) {
    this.userService.AltaUsuario(id).subscribe({
      next: (data) => {
        console.log(data);
        this.ngOnInit();
      },
      error: (e) => {
        if (e.status == 500) {
          this.toastService.showError('Error interno del servidor, intentelo más tarde.');
          console.log(e);
        }
        else if (e.status == 400) {
          this.toastService.showError(e.error.mensaje);
        }
        else if (e.status == 403) {
          this.toastService.showError('No tienes permisos para realizar esta acción.');
        }
        else {
          this.toastService.showError('Error desconocido, intentelo más tarde.');
          console.log(e);
        }      }
    })
  }

  EditarUsuario(id : number, name: string) {
    this.dialog.open(EditDialogComponent, {
      data: {
        title: 'Editar Usuario',
        fields: [
          {
            name: 'name',
            label: 'Nombre del usuario',
            value: name,
            validators: [Validators.required, Validators.minLength(3)]
          },
        ]
      },
      width: '400px',
      panelClass: 'custom-dialog-container'
    }).afterClosed().subscribe(result => {
      if (result) {
        const userData = {
          id: id,
          name: result.name,
          rol: result.rol,
          status: result.status
        };

        this.userService.EditarUsuario(userData).subscribe({
          next: (data) => {
            console.log(data);
            this.ngOnInit();
            this.toastService.showSuccess('Usuario editado correctamente.');
          },
          error: (e) => {
            if (e.status == 500) {
              this.toastService.showError('Error interno del servidor, intentelo más tarde.');
              console.log(e);
            }
            else if (e.status == 400) {
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
    })

  }

  cambiarStatus() {
    this.mostrarInactivos = !this.mostrarInactivos;
    console.log(this.mostrarInactivos);
    this.ObtenerUsuarios(this.idCompany, this.mostrarInactivos);
  }
}
