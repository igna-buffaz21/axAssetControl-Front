import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../routes/api.routes';
import { Observable } from 'rxjs';
import { Sector } from '../interfaces/sector.interfaz';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  constructor(private http: HttpClient) { }

  ObtenerSectores(id: number, idEmpresa: number, status: boolean) : Observable<Sector[]> {
    return this.http.get<Sector[]>(API_ROUTES.SECTOR.GET_ALL_SECTORS(id, idEmpresa, status));
  }

  CrearSector(locationData: any) : Observable<any> {

    const body = {idLocation: locationData.idLocation, name: locationData.name, idEmpresa: locationData.idEmpresa};

    return this.http.post(API_ROUTES.SECTOR.CREATE_SECTOR, body);
  }

  EliminarSector(id: number) : Observable<any> {
    const body = { id: id };

    console.log("Eliminando sector con ID: " + body.id);

    return this.http.put(API_ROUTES.SECTOR.DELETE_SECTOR, body.id);
  }

  EditarSector(locationData: any) : Observable<any> {
    const body = {id: locationData.id, name: locationData.name};

    return this.http.put(API_ROUTES.SECTOR.EDIT_SECTOR, body);
  }

  /*ObtenerSectorPorNombre(idLocacion: number, name: any) : Observable<any> {
    return this.http.get<any>(API_ROUTES.SECTOR.GET_SECTOR_NAME(idLocacion, name))
  }

  FiltrarSectores(idLocacion: number, orden: string) : Observable<any> {
    return this.http.get<any>(API_ROUTES.SECTOR.GET_SECTOR_FILT(idLocacion, orden))
  }*/

}
