import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  ObtenerTodasLasEmpresas(mostrarInactivos: boolean) : Observable<any> {
    return this.http.get<any>(API_ROUTES.COMPANY.GET_ALL(mostrarInactivos));
  }

  CrearEmpresa(data: any) : Observable<any> {
    const body = {name: data.name}

    return this.http.post(API_ROUTES.COMPANY.CREATE_COMPANY, body)
  }

  AltaBajaEmpresa(idCompany: number, status: boolean) {
    console.log("SERVICIO" + status)
    
    const body = {id: idCompany, status: status}

    return this.http.put(API_ROUTES.COMPANY.CHANGE_STATUS, body);
  }

  EditarEmpresa(data: any) : Observable<any> {
    const body = {id: data.id, name: data.name}

    return this.http.put(API_ROUTES.COMPANY.EDIT_COMPANY, body);
  }

  obtenerNombreEmpresaPorId(id: number) : Observable<any> {
    return this.http.get<any>(API_ROUTES.COMPANY.GET_NAME(id));
  }
 }
