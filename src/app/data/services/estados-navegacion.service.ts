import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadosNavegacionService {
  private locationId: number | null = null;
  private sectorId: number | null = null;
  private SubSectorId: number | null = null;
  private lastUrl: string | null = null;


  constructor() { }


  //--LOCACION--//
  setLocationId(id: number) { 
    this.locationId = id;
    localStorage.setItem('locationId', id.toString());
    console.log("ID LOCACION_GUARDADO " + this.locationId);
  }///guarda el id en una variable y en el localStorage

  getLocationId(): number {
    if (this.locationId !== null) {
      console.log("RETORNO LOCACION " + this.locationId);
      return this.locationId;
    }///si la pagina no se recarga, devuelve el id guardado en la variable

    else {
      const storedId = localStorage.getItem('locationId');
      if (storedId !== null) {
        this.locationId = Number(storedId);
        console.log("RETORNO LOCACION_LOCALSTORAGE " + this.locationId);
        return this.locationId
      }
      else {
        return 0; 
      }
    }///si la pagina se recarga, devuelve el id guardado en el localStorage
  }

  //--SECTORES--//
  setSectorId(id: number) { 
    this.sectorId = id;
    localStorage.setItem('sectorId', id.toString());
    console.log("ID SECTOR_GUARDADO " + this.sectorId);
  }

  getSectorId(): number {
    if (this.sectorId !== null) {
      console.log("RETORNO SECTOR_ID " + this.sectorId);
      return this.sectorId;
    }

    else {
      const SECTOR_ID = localStorage.getItem('sectorId');
      if (SECTOR_ID !== null) {
        this.sectorId = Number(SECTOR_ID);
        console.log("RETORNO SECTOR_ID_LOCALSTORAGE " + this.sectorId);
        return this.sectorId
      }
      else {
        return 0; 
      }
    }
  }

    //--SUBSECTORES--//
    setSubSectorId(id: number) { 
      this.SubSectorId = id;
      localStorage.setItem('SubSectorId', id.toString());
      console.log("ID SUBSECTOR " + this.SubSectorId);
    }
  
    getSubSectorId(): number {
      if (this.SubSectorId !== null) {
        console.log("RETORNO_SUBSECTOR_ID " + this.SubSectorId);
        return this.SubSectorId;
      }
  
      else {
        const SUBSECTOR_ID = localStorage.getItem('SubSectorId');
        if (SUBSECTOR_ID !== null) {
          this.SubSectorId = Number(SUBSECTOR_ID);
          console.log("RETORNO_SUBSECTOR_ID_LOCALSTORAGE " + this.SubSectorId);
          return this.SubSectorId
        }
        else {
          return 0; 
        }
      }
    }

    SetLastUrl(url: string) {
      this.lastUrl = url;
      console.log('guardando ultima url: ' + url);
      localStorage.setItem('lastUrl', url);
    }

    getLastUrl() {
      if (this.lastUrl == null || this.lastUrl == undefined) {
        console.log('ultima url no guardada, devolviendo la de localStorage');
        this.lastUrl = localStorage.getItem('lastUrl');
      }

      console.log('redirecting to lastUrl: ' + this.lastUrl);

      return this.lastUrl;
    }
}
