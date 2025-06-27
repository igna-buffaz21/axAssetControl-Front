export interface UsuarioDTO {
    id: number,
    name: string,
    email: string,
    rol: string,
    status: string
    idCompanyNavigation: EmpresaDTO
}

export interface EmpresaDTO {
    id: number,
    name: string,
    status: string
}