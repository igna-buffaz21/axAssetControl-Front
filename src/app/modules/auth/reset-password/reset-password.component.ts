import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../data/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../data/services/toast.service';
import { EditDialogComponent } from '../../../layout/edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  hideConfirm = true;
  valid = true;
  token: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastService: ToastService, private route: ActivatedRoute) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },); // <-- Aquí va
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');

    console.log(this.token);

    
  }

  toggleConfirmVisibility() {
    this.hideConfirm = !this.hideConfirm;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (pass != confirm) {
      this.valid = false; // 👈 esto fuerza mostrar errores
    }
    else {
      this.valid = true; // 👈 esto fuerza mostrar errores
    }

    return this.valid
  }

  onSubmit() {
    this.valid = this.passwordsMatchValidator(this.resetForm);
    if (!this.valid) {
      this.toastService.showError("Las contraseñas no coinciden");
      return;
    }

    this.isLoading = true; 

    const newPassword = this.resetForm.value.newPassword.trim();

    if (!this.token) {
      this.toastService.showError("Token de restablecimiento no válido");
      this.isLoading = false;
      return;
    }

    console.log("New Password: " + newPassword);
    console.log("Token: " + this.token);

    this.authService.CambiarContrasena(this.token, newPassword).subscribe({
      next: (data) => {
        console.log(data);
        this.toastService.showSuccess("Contraseña cambiada exitosamente, Redirigiendo a inicio de sesión...");
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);

        }, 2000); // Redirige después de 2 segundos
      },
      error: (e) => {
        if (e.status == 400) {
          this.toastService.showError(e.error.mensaje);
        } else {
          this.toastService.showError("Error al cambiar la contraseña");
        }
        this.isLoading = false;
      }
    })

  }
}