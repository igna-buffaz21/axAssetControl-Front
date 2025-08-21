import { environment } from "../../../enviroments/enviroment";

export const API_ROUTES = {
    USER: {
        LOGIN: `${environment.apiUrl}api/Auth/login`,
        GET_ALL_USERS: `${environment.apiUrl}api/Usuario/ObtenerUsuariosPorCompania/`,
        CREATE_USER: `${environment.apiUrl}api/Usuario/CrearUsuario`,
        DELETE_USER: `${environment.apiUrl}api/Usuario/EliminarUsuario/`,
        EDIT_USER: `${environment.apiUrl}api/Usuario/ActualizarUsuario`,
        STATUSB: `${environment.apiUrl}api/Usuario/BajaUsuario`,
        STATUSA: `${environment.apiUrl}api/Usuario/AltaUsuario`,
        GET_USERS_NAME: (name: string, status: string, idCompany: number) => `${environment.apiUrl}api/Usuario/ObtenerUsuarioPorNombre?name=${name}&status=${status}&idCompany=${idCompany}`,
        GET_ADMIN: (role: string, status: boolean) => `${environment.apiUrl}api/Usuario/ObtenerAdministradores?role=${role}&status=${status}`,
        CHANGE_PASSWORD: `${environment.apiUrl}api/Auth/RecuperarPassword`,
        RESET_PASSWORD: `${environment.apiUrl}api/Auth/CambiarPassword`,
    },
    LOCATION: {
        GET_ALL_LOCATIONS: (idCompany: number, status: boolean) => `${environment.apiUrl}api/Locacion/Empresa/${idCompany}?status=${status}`,
        CREATE_LOCATION: `${environment.apiUrl}api/Locacion/CrearLocacion`,
        DELETE_LOCATION: `${environment.apiUrl}api/Locacion/CambiarEstado`,
        EDIT_LOCATION: `${environment.apiUrl}api/Locacion/ActualizarLocacion`,
        GET_LOCATIONS_NAME: (idCompany: number, name: string) => `${environment.apiUrl}api/Locacion/ObtenerLocacionPorNombre/${idCompany}?name=${name}`,
        GET_LOCATIONS_FILT: (idCompany: number, orden: string) => `${environment.apiUrl}api/Locacion/FiltarLocaciones/${idCompany}?orden=${orden}`

    },
    SECTOR: {
        GET_ALL_SECTORS: (id_locacion: number, id_empresa: number, status: boolean) => `${environment.apiUrl}api/Sector/Locacion/${id_locacion}?idEmpresa=${id_empresa}&status=${status}`,
        CREATE_SECTOR: `${environment.apiUrl}api/Sector/CrearSector`,
        DELETE_SECTOR: `${environment.apiUrl}api/Sector/CambiarEstado`,
        EDIT_SECTOR: `${environment.apiUrl}api/Sector/ActualizarSector`,
        GET_SECTOR_NAME: (idLocacion: number, name: string) => `${environment.apiUrl}api/Sector/ObtenerSectorPorNombre/${idLocacion}?name=${name}`,
        GET_SECTOR_FILT: (idLocacion: number, orden: string) => `${environment.apiUrl}api/Sector/FiltarSectores/${idLocacion}?orden=${orden}`
    },
    SUBSECTOR: {
        GET_ALL_SUBSECTORS: (id_sector: number, id_empresa: number, status: boolean) => `${environment.apiUrl}api/SubSector/Sector/${id_sector}?idEmpresa=${id_empresa}&status=${status}`,
        CREATE_SUBSECTOR: `${environment.apiUrl}api/SubSector/CrearSubSector`,
        DELETE_SUBSECTOR: `${environment.apiUrl}api/SubSector/CambiarEstado`,
        EDIT_SUBSECTOR: `${environment.apiUrl}api/SubSector/ActualizarSubSector`,
        GET_SECTOR_NAME: (idSector: number, name: string) => `${environment.apiUrl}api/SubSector/ObtenerSubSectorPorNombre/${idSector}?name=${name}`,
        GET_SECTOR_FILT: (idSector: number, orden: string) => `${environment.apiUrl}api/SubSector/FiltarSubSectores/${idSector}?orden=${orden}`
    },
    ASSET: {
        GET_ALL_ASSETS: (id_subSector: number, id_empresa: number, status: boolean) => `${environment.apiUrl}api/Activo/SubSector/${id_subSector}?idEmpresa=${id_empresa}&status=${status}`,
        CREATE_ASSET: `${environment.apiUrl}api/Activo/CrearActivo`,
        DELETE_ASSET: `${environment.apiUrl}api/Activo/CambiarEstado`,
        EDIT_ASSET: `${environment.apiUrl}api/Activo/ActualizarActivo`,
        GET_ASSET_NAME: (idSubSector: number, name: any) => `${environment.apiUrl}api/Activo/ObtenerActivoPorNombre/${idSubSector}?name=${name}`,
        GET_ASSET_FILT: (idSubSector: number, orden: string) => `${environment.apiUrl}api/Activo/FiltarActivos/${idSubSector}?orden=${orden}`
    },
    CONTROL_RECORD: {
        GET_ALL_LOG: (idSubSector: number) => `${environment.apiUrl}api/RegistroControl/ObtenerHistorialPorSubSector?idSubSector=${idSubSector}`,
        GET_LAST_CONTROL: (idSubSector: number) => `${environment.apiUrl}api/RegistroControl/ObtenerUltimoRegistroControl?idSubsector=${idSubSector}`,
        GET_CONTROL_FOR_ID: (id: number, idCompany: number) => `${environment.apiUrl}api/RegistroControl/ObtenerRegistroControlEspecifico?id=${id}&idCompany=${idCompany}`,
        GET_MISSING_ASSETS: (idCompany: number) => `${environment.apiUrl}api/RegistroControl/ObtenerActivosPerdidos?idCompany=${idCompany}`,
        GET_LAST_CONTROL_NAME: (idSubSector: number, nombre: any) => `${environment.apiUrl}api/RegistroControl/ObtenerUltimoControlPorNombreActivo?idSubsector=${idSubSector}&nombre=${nombre}`,
    },
    COMPANY: {
        GET_ALL: (mostrarInactivos: boolean) => `${environment.apiUrl}api/Empresa/ObtenerEmpresas?mostrarInactivos=${mostrarInactivos}`,
        CREATE_COMPANY: `${environment.apiUrl}api/Empresa/CrearEmpresa`,
        CHANGE_STATUS: `${environment.apiUrl}api/Empresa/AltaBajaEmpresa`,
        EDIT_COMPANY: `${environment.apiUrl}api/Empresa/ActualizarEmpresa`,
        GET_NAME: (id: number) => `${environment.apiUrl}api/Empresa/ObtenerNombredeEmpresPorId?id=${id}`
    }
}