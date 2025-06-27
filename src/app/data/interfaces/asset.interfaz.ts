export interface Asset {
    id: number,
    idActiveType: number,
    idSubsector: number,
    model: string,
    name: string,
    seriaNumber: string,
    tagRfid: string,
    brand: string,
}

export interface AssetControl {
    id: number,
    name: string,
    tagRfid: string,
    brand: string,
}