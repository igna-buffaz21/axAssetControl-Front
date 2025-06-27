export interface ControlRecordDTO {
    id: number;
    idSubsector: number;
    date: string; // o Date si lo parseás
    detailControls: DetailControlDTO[];
    idSubsectorNavigation: SubSectorDTO;
  }
  
  export interface DetailControlDTO {
    id: number;
    status: string;
    idActivoNavigation: ActiveDTO;
    idAuditorNavigation: UserDTO;
  }
  
  export interface ActiveDTO {
    id: number;
    name: string;
    brand: string;
    tagRfid: string;
  }
  
  export interface UserDTO {
    id: number;
    name: string;
  }

  export interface SubSectorDTO {
    id: number,
    name: string,
    tagRfid: string
    idSectorNavigation: SectorDTO
  }

  export interface SectorDTO {
    id: number,
    name: string
  }
  