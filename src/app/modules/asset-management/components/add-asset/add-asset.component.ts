import { Component } from '@angular/core';
import { SkeletonComponent } from "../../../../layout/skeleton/skeleton/skeleton.component";
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadosNavegacionService } from '../../../../data/services/estados-navegacion.service';
import { AssetService } from '../../../../data/services/asset.service';
import { ToastService } from '../../../../data/services/toast.service';
import { AuthService } from '../../../../data/services/auth.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgFor } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-add-asset',
  imports: [MatSelectModule,AsyncPipe, NgFor, SkeletonComponent, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule, MatAutocompleteModule],
  templateUrl: './add-asset.component.html',
  styleUrl: './add-asset.component.css'
})
export class AddAssetComponent {
  locationForm!: FormGroup;
  idSubSector: any | null;

    opciones: string[] = [
      // Muebles
      'Silla',
      'Sillón',
      'Escritorio',
      'Mesa',
      'Mesa de reuniones',
      'Mesa de trabajo',
      'Armario',
      'Estantería',
      'Archivador',
      'Gabinete',
      'Cajonera',
      'Banco',
      'Perchero',
      'Pizarra',
      'Panel divisor',
      'Carrito',
      'Mostrador',
    
      // Tecnología
      'Computadora',
      'Monitor',
      'Teclado',
      'Mouse',
      'Impresora',
      'Escáner',
      'Proyector',
      'Servidor',
      'Router',
      'Switch',
      'Teléfono',
      'Cámara de seguridad',
      'Tablet',
    
      // Climatización y electrodomésticos
      'Aire acondicionado',
      'Ventilador',
      'Estufa',
      'Radiador',
      'Calefactor',
      'Microondas',
      'Heladera',
    
      // Herramientas y mantenimiento
      'Taladro',
      'Destornillador eléctrico',
      'Caja de herramientas',
      'Escalera',
      'Carro de carga',
      'Andamio',
    
      // Otros
      'Basurero',
      'Reloj de pared',
      'Extintor',
      'Botiquín',
      'Lámpara',
      'Dispenser de agua'
    ];

    marcas: string[] = [
      // Tecnología
      'HP',
      'Dell',
      'Lenovo',
      'Asus',
      'Acer',
      'Apple',
      'Samsung',
      'LG',
      'Sony',
      'Toshiba',
      'Canon',
      'Epson',
      'Brother',
      'Xerox',
      'Microsoft',
      'Huawei',
      'Motorola',
    
      // Muebles y oficina
      'Ikea',
      'Steelcase',
      'Herman Miller',
      'Tecno',
      'Ofipack',
    
      // Electrodomésticos
      'Philips',
      'Whirlpool',
      'Electrolux',
      'Midea',
      'Bosch',
      'Siemens',
      'Panasonic',
      'Hitachi',
      'Daewoo',
      'GE',
      'Ariston',
    
      // Herramientas
      'Stanley',
      'Black & Decker',
      'Makita',
      'DeWalt',
      'Bosch Tools',
      'Einhell',
    
      // Otros
      'Pioneer',
      'Sharp',
      'ViewSonic',
      'BenQ'
    ];
    
    opcionesFiltradas!: Observable<string[]>;

    opcionesFiltradasMarca!: Observable<string[]>;


  constructor(private authService: AuthService,private fb: FormBuilder, private estadoNavegacionSerivice: EstadosNavegacionService, private assetService: AssetService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.minLength(2)]],
      model: ['', [Validators.minLength(2)]],
      serialNumber: ['', [Validators.pattern('^[a-zA-Z0-9-]*$')]],
      assetType: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });

    this.idSubSector = this.estadoNavegacionSerivice.getSubSectorId()

        // Filtrado automático al escribir
        this.opcionesFiltradas = this.locationForm.get('name')!.valueChanges.pipe(
          startWith(''),
          map(valor => this.filtrar(valor || ''))
        );

          // Autocomplete para el campo "brand"
        this.opcionesFiltradasMarca = this.locationForm.get('brand')!.valueChanges.pipe(
          startWith(''),
          map(valor => this.filtrarMarca(valor || ''))
  );
  }

  private filtrar(valor: string): string[] {
    const filtro = valor.toLowerCase();
    return this.opciones.filter(opcion =>
      opcion.toLowerCase().includes(filtro)
    );
  }

  private filtrarMarca(valor: string): string[] {
    const valorFiltrado = valor.toLowerCase();
    return this.marcas.filter(marca =>
      marca.toLowerCase().includes(valorFiltrado)
    );
  }

  CrearActivo() {
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      const data = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        idSubsector: this.idSubSector,
        idActiveType: formData.assetType,
        cantity: formData.cantity,
        idEmpresa: Number(this.authService.obtenerIdEmpresa())
      };
      this.assetService.CrearActivo(data).subscribe({
        next: (data) => {
          console.log(data);
          this.toastService.showSuccess("Activo creado correctamente");
          this.locationForm.reset();
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
    } else {
      console.log('Formulario inválido');
    }
  }
}
