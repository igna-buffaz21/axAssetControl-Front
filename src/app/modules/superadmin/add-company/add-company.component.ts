import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadosNavegacionService } from '../../../data/services/estados-navegacion.service';
import { SubsectorService } from '../../../data/services/subsector.service';
import { ToastService } from '../../../data/services/toast.service';
import { CompanyService } from '../../../data/services/company.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-company',
  imports: [SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css'
})
export class AddCompanyComponent {
  companyForm: FormGroup;
  isLoading: boolean = false;

  constructor(private companyService: CompanyService ,private fb: FormBuilder, private estadosNavegacionService: EstadosNavegacionService, private subSectorService: SubsectorService, private toastService: ToastService) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  CrearEmpresa() {
    this.isLoading = true;
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      const data = {
        name: formData.name
      }
      this.companyService.CrearEmpresa(data).subscribe({
        next: (data) => {
          console.log(data);
          this.toastService.showSuccess(data.mensaje);
          this.companyForm.reset();
          this.isLoading = false;
        },
        error: (e) => {
          if (e.status == 400) {
            this.toastService.showError(e.error.mensaje);
            this.isLoading = false;
          }
          else if (e.status == 500) {
            this.toastService.showError(e.error.mensaje);
            this.isLoading = false;
          }
          else if (e.status == 403) {
            this.toastService.showError('No tienes permisos para realizar esta acción.');
            this.isLoading = false;
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
}
