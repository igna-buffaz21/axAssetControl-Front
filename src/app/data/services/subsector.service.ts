import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../routes/api.routes';
import { Observable } from 'rxjs';
import { SubSector } from '../interfaces/subSector.interfaz';

@Injectable({
  providedIn: 'root'
})
export class SubsectorService {

  constructor(private http: HttpClient) { }

  ObtenerSubsectores(id: number, idEmpresa: number, status: boolean) : Observable<SubSector[]> {
    return this.http.get<SubSector[]>(API_ROUTES.SUBSECTOR.GET_ALL_SUBSECTORS(id, idEmpresa, status));
  }

  CrearSubsector(data: any) {
    const body = { idSector: data.idSector, name: data.name, tagRfid: data.tagRfid, idEmpresa: data.idEmpresa };
    console.log(body);

    return this.http.post(API_ROUTES.SUBSECTOR.CREATE_SUBSECTOR, body);
  }

  EliminarSubsector(id: number) {
    const body = { id: id };

    return this.http.put(API_ROUTES.SUBSECTOR.DELETE_SUBSECTOR, body.id);
  }

  EditarSubsector(data: any) {
    const body = { id: data.id, name: data.name};
    console.log(body);

    return this.http.put(API_ROUTES.SUBSECTOR.EDIT_SUBSECTOR, body);
  }

  /*ObtenerSubSectorPorNombre(idSector: number, name: any) : Observable<any> {
    return this.http.get<any>(API_ROUTES.SUBSECTOR.GET_SECTOR_NAME(idSector, name));
  }

  FiltrarSubSectores(idSector: number, orden: string) : Observable<any> {
    return this.http.get<any>(API_ROUTES.SUBSECTOR.GET_SECTOR_FILT(idSector, orden));
  }*/
}
