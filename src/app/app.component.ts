import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './layout/toast/toast.component';
import { EstadosNavegacionService } from './data/services/estados-navegacion.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'axAssetControl-Front';

  constructor(private router: Router, private navigationService: EstadosNavegacionService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.navigationService.SetLastUrl(event.urlAfterRedirects);
        console.log("Ultima URL guardada: " + event.urlAfterRedirects);
      }
    })
  }
}
