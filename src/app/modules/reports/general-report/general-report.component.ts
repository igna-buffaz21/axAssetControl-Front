import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../layout/skeleton/skeleton/skeleton.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { LocationService } from '../../../data/services/location.service';
import { SectorService } from '../../../data/services/sector.service';
import { SubsectorService } from '../../../data/services/subsector.service';
import { AuthService } from '../../../data/services/auth.service';
import { Location } from '../../../data/interfaces/location.interfaz';
import { Sector } from '../../../data/interfaces/sector.interfaz';
import { SubSector } from '../../../data/interfaces/subSector.interfaz';
import { ControlRecordService } from '../../../data/services/control-record.service';
import { ActiveDTO, ControlRecordDTO, DetailControlDTO, UserDTO } from '../../../data/interfaces/detailControl.interfaz';
import { debounceTime, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import { ToastService } from '../../../data/services/toast.service';

@Component({
  selector: 'app-general-report',
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, MatMenuModule, SkeletonComponent, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './general-report.component.html',
  styleUrl: './general-report.component.css'
})
export class GeneralReportComponent {
  idCompany!: string;
  //selects
  locations!: Location[];
  sectors!: Sector[];
  subsectors!: SubSector[];
  assets!: ActiveDTO[];
  detailControlOriginal: DetailControlDTO[] = [];
  detailControl!: DetailControlDTO[];
  control!: ControlRecordDTO;
  user!: UserDTO[]
  selectedLocation: any;
  selectedSector: any;
  selectedSubsector: any;
  showSelect: boolean = true;
  //desabilitacion
  desHabilitarSelectL: boolean = false;
  desHabilitarSelectS: boolean = true;
  desHabilitarSelectSS: boolean = true;
  ultimoControl!: any | null;
  filtro: string = "";
  searchControl = new FormControl('');
  searchSuscription!: Subscription;
  isLoading: boolean = false;
  status: boolean = true; // Variable para controlar el estado de las locaciones (activas/inactivas)

  constructor(private toastService: ToastService,private route: ActivatedRoute, private authService: AuthService ,private locacionService: LocationService, private sectorService: SectorService, private subSectorService: SubsectorService, private controlRecordService: ControlRecordService) {}

  ngOnInit(): void {
    this.searchControl.disable();
    console.clear();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        const id = Number(idParam);
        this.showSelect = false;
        console.log(id);
        this.idCompany = this.authService.obtenerIdEmpresa()
        this.ObtenerControlEspecifico(id, Number(this.idCompany));
      }
      else {
        this.resetFiltros();
        this.idCompany = this.authService.obtenerIdEmpresa()
        this.CargarLocaciones(Number(this.idCompany));
      }
    })
    
        this.searchControl.valueChanges.pipe(
          debounceTime(300), 
          distinctUntilChanged(),
        ).subscribe((value) => {
          const termino = value?.trim().toLowerCase();
          if (!termino) {
            this.detailControl = this.detailControlOriginal;
            return;
          }

          this.detailControl = this.detailControlOriginal.filter(dc => dc.idActivoNavigation?.name?.toLowerCase().includes(termino)
          );
        });
  }

  CargarLocaciones(id: number) {
    this.locacionService.getLocations(id, this.status).subscribe({
      next: (data) => {
        console.log(data);
        this.locations = data;
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

  CambioLocacion(locacionId: string) {
    this.sectors = [];
    this.subsectors = [];
    this.detailControl = [];
    this.desHabilitarSelectS = true;
    this.desHabilitarSelectSS = true;
    this.ultimoControl = 's'; // en caso de error o sin controles

    this.selectedSector = null;      // <-- reset visual del select sector
    this.selectedSubsector = null;   // <-- reset visual del select subsector

    this.selectedLocation = locacionId;
    console.log("LOCACION ID " + locacionId);
    this.CargarSectores(this.selectedLocation)
    this.desHabilitarSelectS = false;
    this.verificarSiPuedeBuscar();
    this.filtro = '';
  }

  CargarSectores(locacionId: string) {
    this.sectorService.ObtenerSectores(Number(locacionId), Number(this.authService.obtenerIdEmpresa()), this.status).subscribe({
      next: (data) => {
        this.sectors = data;
        console.log(data);
        this.selectedSector = null; // <--- esto resetea visualmente el select
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

  CambioSector(sectorId: string) {
    this.detailControl = [];
    this.subsectors = [];
    this.ultimoControl = 's'; // en caso de error o sin controles
    this.selectedSubsector = null;

    this.selectedSector = sectorId;
    console.log("SECTOR ID " + sectorId);
    this.CargarSubSectores(this.selectedSector);
    this.desHabilitarSelectSS = false;
    this.verificarSiPuedeBuscar();
    this.filtro = '';
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
    this.controlRecordService.ObtenerUltimoControl(Number(subSectorId)).subscribe({
      next: (data: ControlRecordDTO) => {
        if (data != null) {
          console.log("SUBSECTOR SELECIONADO " + this.selectedSubsector);
          this.verificarSiPuedeBuscar();
          this.detailControlOriginal = data.detailControls;
          this.detailControl = [];
          this.detailControl = [...this.detailControlOriginal];
        }
        else {
          this.detailControl = [];
          this.ultimoControl = null; // en caso de error o sin controles
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
    this.verificarSiPuedeBuscar();
    this.filtro = '';
  }

  ObtenerControlEspecifico(id: number, idCompany: number) {
    this.controlRecordService.ObtenerControlEspecifico(id, idCompany).subscribe({
      next: (data: ControlRecordDTO) => {
        this.detailControlOriginal = data.detailControls;
        this.detailControl = [...this.detailControlOriginal]
        console.log(this.detailControl);
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

  resetFiltros() {
    this.selectedLocation = null;
    this.selectedSector = null;
    this.selectedSubsector = null;
  
    this.sectors = [];
    this.subsectors = [];
    this.detailControl = [];

    this.desHabilitarSelectS = true;
    this.desHabilitarSelectSS = true;
    this.verificarSiPuedeBuscar();
    this.filtro = '';
  }

  OrdenarActivos(orden: string) {
    if (!orden) return;
    this.isLoading = true;
    
    const filtro = [...this.detailControl].sort((a, b) => {
      const NombreA = a.idActivoNavigation.name.toLowerCase();
      const NombreB = b.idActivoNavigation.name.toLowerCase();

      if (orden === 'asc') {
        return NombreA.localeCompare(NombreB);
      }
      else {
        return NombreB.localeCompare(NombreA);
      }
    });

    this.detailControl = filtro;
    this.isLoading = false;
  }

  verificarSiPuedeBuscar() {
    if (this.selectedLocation && this.selectedSector && this.selectedSubsector) {
      this.searchControl.enable();
    } else {
      this.searchControl.disable();
    }
  }  
}
