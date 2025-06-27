import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../routes/api.routes';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers(idCompany: number, mostrarInactivos: boolean): Observable<any> {

    const status = mostrarInactivos ? 'disabled' : 'actived';

    return this.http.get<any>(API_ROUTES.USER.GET_ALL_USERS + idCompany + '?status=' + status);
  }

  CrearUsuario(UserData: any): Observable<any> {
    const body = { idCompany: UserData.idCompany, name: UserData.name, email: UserData.email, password: UserData.password, rol: UserData.rol, status: UserData.status };
    
    console.log(body);

    return this.http.post<any>(API_ROUTES.USER.CREATE_USER, body);
  }

  BajaUsuario(id: number) {
    return this.http.put<any>(API_ROUTES.USER.STATUSB, id)
  }

  AltaUsuario(id: number) {
    return this.http.put<any>(API_ROUTES.USER.STATUSA, id)
  }

  EditarUsuario(UserData: any): Observable<any> {
    const body = { id: UserData.id, name: UserData.name};
    
    console.log(body);

    return this.http.put<any>(API_ROUTES.USER.EDIT_USER, body);
  }

  BuscarUsuariosPorNombre(name: any, mostrarInactivos: boolean, idCompany: number) {

    const status = mostrarInactivos ? 'disabled' : 'actived';

    console.log(name)
    console.log(status)
    console.log(idCompany)

    return this.http.get<any>(API_ROUTES.USER.GET_USERS_NAME(name, status, idCompany))
  }

  ObtenerAdministradores(role: string, status: boolean) : Observable<any> {
    return this.http.get<any>(API_ROUTES.USER.GET_ADMIN(role, status));
  }

}