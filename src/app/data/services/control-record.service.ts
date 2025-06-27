import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlRecordService {

  constructor(private http: HttpClient) { }

  ObtenerUltimoControl(idSubsector: number): Observable<any> {
    return this.http.get<any>(API_ROUTES.CONTROL_RECORD.GET_LAST_CONTROL(idSubsector))
  }

  ObtenerHistorialAditorias(idSubsector: number): Observable<any> {
    return this.http.get<any>(API_ROUTES.CONTROL_RECORD.GET_ALL_LOG(idSubsector))
  }

  ObtenerControlEspecifico(id: number, idCompany: number): Observable<any> {
    return this.http.get<any>(API_ROUTES.CONTROL_RECORD.GET_CONTROL_FOR_ID(id, idCompany))
  }

  ObtenerControlUPCSAP(idCompany: number): Observable<any> {
    return this.http.get<any>(API_ROUTES.CONTROL_RECORD.GET_MISSING_ASSETS(idCompany))
  }

  ObtenerUltimoControlPorNombreActivo(idSubsector: number, nombre: any): Observable<any> {
    return this.http.get<any>(API_ROUTES.CONTROL_RECORD.GET_LAST_CONTROL_NAME(idSubsector, nombre))
  }

}
