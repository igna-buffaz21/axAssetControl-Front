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
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UsuarioDTO } from '../../../data/interfaces/user.interface';

@Component({
  selector: 'app-users-management',
  imports: [SkeletonComponent, RouterModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css'
})
export class UsersManagementComponent {
  originalUsers: UsuarioDTO[] = [];
  users: UsuarioDTO[] = [];
  mostrarInactivos: boolean = false;
  searchControl = new FormControl('');
  private searchSubscription!: Subscription;  // Guardamos la suscripción

  constructor(private userService: UserService, private dialog: MatDialog, private toastService: ToastService) {}

  ngOnInit() {
    this.ObtenerAdministradores(this.mostrarInactivos);

    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Espera 300ms después de que el usuario deja de escribir
      distinctUntilChanged(), // Solo emite si el valor ha cambiado
      map(value => {
        const termino = value?.trim().toLowerCase() || '';

        if (!termino) {
          this.users = [...this.originalUsers];
        }

        console.log("Buscando usuarios con el término:", termino);
        this.users = this.originalUsers.filter(u => u.name.toLowerCase().includes(termino));
      })
    ).subscribe();
  }

  ObtenerAdministradores(status: boolean) {
    this.userService.ObtenerAdministradores('admin', status).subscribe({
      next: (data) => {
        this.originalUsers = data;
        this.users = [...this.originalUsers];
        console.log(data);
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
    this.ngOnInit();
  }

  EditarUsuario(id: number, name: string) {
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
        const locationData = {
          id: id,
          name: result.name
        }
        console.log(result)
        console.log(locationData);
        this.userService.EditarUsuario(locationData).subscribe({
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

  eliminarUsuarioConConfirmacion(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: "Desactivar usuario",
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

  darDeAltaConfirmacion(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: "Activar usuario",
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
