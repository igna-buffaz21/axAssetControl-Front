import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatListModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  axResponse!: any
  esAdmin!: any
  projectName!: any

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getListaControles();
  }

  setHomePage(){
    //this.router.navigateByUrl(this.STR_HOME);
  }

  setPage(url: string){
    this.router.navigateByUrl(url);
  }
  
  onClick(idControl: number){
    //this.controlAccesoService.updateControl(idControl);
    // this.controlAccesoService.getOne(idControl).subscribe((data) => {
    //   this.control = data;
    //   console.log(this.control);
    // })
   //agrego el spinner para mostrar q esta cargando                      
  //this.spinnerService.showLoadingSpinner();
  //this.router.navigateByUrl(this.STR_CONTROL_ACCESO);
  //this.spinnerService.hideLoadingSpinner();

}
  
  getListaControles(){
    //this.controlAccesoService.getListaAsync().subscribe((data) => {
      // this.listaControles = data.map(control => control.nombre);
      //this.axResponse = data;
      // this.listaControles.name.charAt(0).toUpperCase() + this.inputString.slice(1).toLowerCase();
      // console.log(this.listaControles)
    //})
  }

  logout(){
    //this.authService.logout();
  }
}
