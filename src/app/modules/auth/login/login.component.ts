import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../data/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../data/services/toast.service';
import { EditDialogComponent } from '../../../layout/edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;
  email!: string;
  password!: string;

  constructor(private dialog: MatDialog ,private fb: FormBuilder, private authService: AuthService, private router: Router, private toastService: ToastService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });    
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;


      console.log("User " + this.loginForm.value.email)
      console.log("Passwor " + this.loginForm.value.password)
    

      this.email = this.loginForm.value.email;
      this.password = this.loginForm.value.password;

      this.email = this.email.trim();
      this.password = this.password.trim();


      this.authService.Login(this.email, this.password).subscribe({ 
        next: (data) => {
          console.log(data);
          if (data.token != '') {
            localStorage.setItem('token', data.token);
            this.isLoading = false;
            this.errorMessage = null;
            const datosUsuario = this.authService.obtenerDatosUsuario();
            const role = datosUsuario?.role;
            if (role == 'superadmin') {
              this.router.navigate(['/sa']);
            }
            else if (role == 'admin' || role == 'operator') {
              this.router.navigate(['/home']);
            }
            else {
              this.toastService.showError("Error al iniciar sesion!");
              this.isLoading = false;
            }
          }
        },
        error: (e) => {
          if (e.status == 400) {
            this.toastService.showError(e.error.mensaje);
            this.isLoading = false;
            console.log(e);
          }
          else if (e.status == 500) {
            this.toastService.showError(e.error.mensaje);
            this.isLoading = false;
            console.log(e);
          }
          else if (e.status == 401) {
            this.toastService.showError("Usuario o contraseña incorrectos.");
            this.isLoading = false;
            console.log(e);
          }
          else if (e.status == 403) {
            this.toastService.showError(e.error.mensaje);
            this.isLoading = false;
            console.log(e);
          }
          else {
            this.toastService.showError('Error desconocido, intentelo más tarde.');
            console.log(e);
            this.isLoading = false;
          }
        }
      })
    }
  }

  ChangePassword() {
    this.dialog.open(EditDialogComponent, {
      data: {
        title: 'Recuperar contraseña',
        fields: [
          {
            name: 'email',
            label: 'Ingrese su correo electrónico',
            type: 'email',
            validators: [Validators.required, Validators.minLength(3)]
          }
        ]
      },
      width: '400px',
      panelClass: 'custom-dialog-container'
    }).afterClosed().subscribe(result => {
      if (result) {
        const locationData = {
          email: result.email
        }
        console.log(result)
        console.log(locationData);
        this.authService.RecuperarContrasena(locationData).subscribe({
          next: (data) => {
            console.log(data);
            this.toastService.showSuccess("Se ha enviado un correo con las instrucciones para cambiar su contraseña.");
          },
          error: (e) => {
            if (e.status == 400) {
              this.toastService.showError(e.error.mensaje);
              console.log(e);
            }
            else if (e.status == 500) {
              this.toastService.showError("Error al enviar el correo, intentelo más tarde.");
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
  }