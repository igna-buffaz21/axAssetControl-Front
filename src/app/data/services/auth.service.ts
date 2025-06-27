import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../routes/api.routes';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token!: string | null;
  decoded!: any;
  userId!: string 
  companyId!: string 
  role!: any;

  constructor(private http: HttpClient, public router: Router, private toastService: ToastService) { }

    Login(email: string, password: string): Observable<any> {
      const body = { email, password };
  
      return this.http.post<any>(API_ROUTES.USER.LOGIN, body);
    }

    Logout() {
      localStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
    }

    isLogged() {
      this.token = localStorage.getItem('token');
      if (this.token) {
        try {
          this.decoded = jwtDecode(this.token);

          if (this.decoded.userId === null || this.decoded.companyId === null || this.decoded.role === null) {
            console.log("Token no contiene los datos necesarios");
            return false;
          }

          console.log("Token contiene los datos necesarios");
          return true;

        } catch (error) {
          console.error('Error decoding token:', error);
          return false;
        }
      }
      else {
        console.log("No hay token en localStorage");
        return false;
      }
    }

    obtenerDatosUsuario() {
        this.token = localStorage.getItem('token');
        
        try {
          this.decoded = jwtDecode(this.token!);
          this.userId = this.decoded.id;
          this.companyId = this.decoded.companyId;
          this.role = this.decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || this.decoded.role;
          console.log(this.decoded);
          return {
            id: this.userId,
            companyId: this.companyId,
            role: this.role
          }
        }
        catch (error) {
          console.error('Error decoding token:', error);
          return null;
        }
    }

    obtenerIdEmpresa() {
      if (this.companyId === undefined || this.companyId === null) {
        this.obtenerDatosUsuario();
      }

      return this.companyId;
    }

    RecuperarContrasena(locationData: any): Observable<any> {
      const body = { email: locationData.email}

      console.log("body " + body);

      return this.http.post<any>(API_ROUTES.USER.CHANGE_PASSWORD, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    CambiarContrasena(token: string, password: string): Observable<any> {
      const body = { 
        token: token,
        newPassword: password,
      };

      console.log("body " + body);

      return this.http.put<any>(API_ROUTES.USER.RESET_PASSWORD, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
}
