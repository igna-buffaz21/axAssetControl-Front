import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../data/services/auth.service';
import { LocationService } from '../../../data/services/location.service';
import { SectorService } from '../../../data/services/sector.service';
import { SubsectorService } from '../../../data/services/subsector.service';
import { ControlRecordService } from '../../../data/services/control-record.service';
import { ControlRecordDTO } from '../../../data/interfaces/detailControl.interfaz';
import { ControlLog } from '../../../data/interfaces/controlRecord.intefaz';
import { ToastService } from '../../../data/services/toast.service';


@Component({
  selector: 'app-audit-log',
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, MatMenuModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})
export class AuditLogComponent {
      idCompany!: any;

      // Para los selectores
      locations: any[] = [];
      sectors: any[] = [];
      subsectors: any[] = [];
      controlRecord!: ControlLog[];
      originalcontrolRecord!: ControlLog[];
      selectedLocation: any;
      selectedSector: any;
      selectedSubsector: any;
      detailControl!: any
      //desabilitacion
      desHabilitarSelectL: boolean = false;
      desHabilitarSelectS: boolean = true;
      desHabilitarSelectSS: boolean = true;
      ultimoControl!: any | null;
      historial!: any | null
      filtro: string = '';
      isLoading: boolean = false;
      status: boolean = true; // Variable para controlar el estado de las locaciones (activas/inactivas)

      constructor(private toastService: ToastService ,private authService: AuthService ,private locacionService: LocationService, private sectorService: SectorService, private subSectorService: SubsectorService, private controlRecordService: ControlRecordService, private router: Router) {}
      

  ngOnInit(): void {
    this.resetFiltros();
    this.idCompany = this.authService.obtenerIdEmpresa()
    this.CargarLocaciones();
  }

  CargarLocaciones() {
    this.locacionService.getLocations(Number(this.idCompany), this.status).subscribe({
      next: (data) => {
        console.log(data);
        this.locations = data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  CambioLocacion(locacionId: string) {
    this.sectors = [];
    this.subsectors = [];
    this.controlRecord = [];
    this.desHabilitarSelectS = true;
    this.desHabilitarSelectSS = true;
    this.historial = 's'; // en caso de error o sin controles

    this.selectedSector = null;      // <-- reset visual del select sector
    this.selectedSubsector = null;   // <-- reset visual del select subsector

    this.selectedLocation = locacionId;
    console.log("LOCACION ID " + locacionId);
    this.CargarSectores(this.selectedLocation)
    this.desHabilitarSelectS = false;
  }

  CargarSectores(locacionId: string) {
    this.sectorService.ObtenerSectores(Number(locacionId), Number(this.authService.obtenerIdEmpresa()), this.status).subscribe({
      next: (data) => {
        this.sectors = data;
        console.log(data);
        this.selectedSector = null; // <--- esto resetea visualmente el select
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  CambioSector(sectorId: string) {
    this.controlRecord = [];
    this.subsectors = [];
    this.historial = 's'; // en caso de error o sin controles
    this.selectedSubsector = null;

    this.selectedSector = sectorId;
    console.log("SECTOR ID " + sectorId);
    this.CargarSubSectores(this.selectedSector);
    this.desHabilitarSelectSS = false;
  }

  CargarSubSectores(sectorId: string) {
    this.subSectorService.ObtenerSubsectores(Number(sectorId), Number(this.authService.obtenerIdEmpresa()), this.status).subscribe({
      next: (data) => {
        this.selectedSubsector = null;
        this.subsectors = data;
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

  CambioSubSector(subSectorId: string) {
    this.controlRecordService.ObtenerHistorialAditorias(Number(subSectorId)).subscribe({
      next: (data) => {
        if (data != null) {
          this.originalcontrolRecord = data; // Guardamos los datos originales para poder ordenar
          this.controlRecord = [...this.originalcontrolRecord]; // Copia de seguridad de los datos originales
        }
        else {
          this.historial = null; // en caso de error o sin historial
        }
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

  VerInformeDeAuditoria(id: number) {
    this.router.navigate(['/reports/general-reports/' + id]);
  }

  resetFiltros() {
    this.selectedLocation = null;
    this.selectedSector = null;
    this.selectedSubsector = null;
  
    this.sectors = [];
    this.subsectors = [];
    this.controlRecord = [];

    this.desHabilitarSelectS = true;
    this.desHabilitarSelectSS = true;
  }

  OrdenarControles(filtro: string) {
    if (!filtro) {
      this.controlRecord = [...this.originalcontrolRecord];
      return;
    }
  
    if (filtro === 'completed') {
      this.controlRecord = this.originalcontrolRecord.filter(control =>
        control.status.toLowerCase() === 'completed'
      );
    } else if (filtro === 'inprogress') {
      this.controlRecord = this.originalcontrolRecord.filter(control =>
        control.status.toLowerCase() === 'inprogress'
      );
    }
    else if (filtro === 'show_all') {
      this.controlRecord = [...this.originalcontrolRecord];
    }
  }
  
}
