import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ROUTES } from '../routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocations(idCompany: number, status: boolean): Observable<any> {
    return this.http.get(API_ROUTES.LOCATION.GET_ALL_LOCATIONS(idCompany, status));
  }

  CrearLocacion(locationData: any): Observable<any> {
    const body = {idCompany: locationData.idCompany, name: locationData.name};

    return this.http.post(API_ROUTES.LOCATION.CREATE_LOCATION, body);
  }

  EliminarLocacion(id: number): Observable<any> {
    const body = {id: id};

    return this.http.put(API_ROUTES.LOCATION.DELETE_LOCATION, body);
  }

  EditarLocacion(locationData: any): Observable<any> {
    const body = {id: locationData.id, name: locationData.name};

    return this.http.put(API_ROUTES.LOCATION.EDIT_LOCATION, body);
  }

  /*ObtenerLocacionPorNombre(idCompany: number, name: any) : Observable<any> {
    return this.http.get<any>(API_ROUTES.LOCATION.GET_LOCATIONS_NAME(idCompany, name));
  }

  FiltarLocaciones(idCompany: number, orden: string) : Observable<any> {
    return this.http.get<any>(API_ROUTES.LOCATION.GET_LOCATIONS_FILT(idCompany, orden));
  } */
}
