// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastService } from '../services/toast.service';
import { EstadosNavegacionService } from '../services/estados-navegacion.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private toastService: ToastService, private estadoNavegacionService: EstadosNavegacionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.toastService.showError('No se ha encontrado sesión activa.');
      this.router.navigate(['/auth/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const requiredRoles = route.data['roles'] as string[];

      if ( decoded.userId === undefined || decoded.companyId === undefined || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === undefined) {
        this.toastService.showError('Datos de usuario no válidos.');
        return false;
      }

      if (requiredRoles && !requiredRoles.includes(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role)) {
        this.toastService.showError('No tenés permiso para acceder.');
        this.router.navigate([this.estadoNavegacionService.getLastUrl()]);
        return false;
      }

      return true;

    } catch (error) {
      this.toastService.showError('Token inválido.');
      console.log(error);
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}

