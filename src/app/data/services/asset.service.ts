import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) { }

  ObtenerActivos(id: number, idEmpresa: number, status: boolean) : Observable<any> {
    return this.http.get<any>(API_ROUTES.ASSET.GET_ALL_ASSETS(id, idEmpresa,status));
  }

  CrearActivo(data: any) : Observable<any> {
    const body = {
      idSubsector: data.idSubsector,
      name: data.name,
      brand: data.brand,
      model: data.model,
      seriaNumber: data.serialNumber,
      tagRfid: data.tagRfid,
      idActiveType: data.idActiveType,
      cantity: data.cantity,
      idEmpresa: data.idEmpresa
    }

    console.log(body);

    return this.http.post<any>(API_ROUTES.ASSET.CREATE_ASSET, body);
  }

  EliminarActivo(id: number) : Observable<any> {
    const body = { id: id };

    return this.http.put<any>(API_ROUTES.ASSET.DELETE_ASSET, body.id);
  }

  EditarActivo(data: any) : Observable<any> {
    const body = {
      id: data.id,
      //idSubsector: data.idSubsector,
      name: data.name,
      brand: data.brand,
      model: data.model,
      seriaNumber: data.seriaNumber,
      tagRfid: data.tagRfid,
      idActiveType: data.idActiveType
    }

    console.log(body);

    return this.http.put<any>(API_ROUTES.ASSET.EDIT_ASSET, body);
  }

  /*
  ObtenerActivoPorNombre(idSubSector: number, name: any) : Observable<any> {
    return this.http.get<any>(API_ROUTES.ASSET.GET_ASSET_NAME(idSubSector, name));
  }

  FiltrarActivos(idSubSector: number, orden: string) : Observable<any> {
    return this.http.get<any>(API_ROUTES.ASSET.GET_ASSET_FILT(idSubSector, orden));
  } */
 
}
