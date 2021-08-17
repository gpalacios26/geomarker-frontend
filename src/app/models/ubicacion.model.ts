import { Capa } from "./capa.model";
import { Usuario } from "./usuario.model";

export class Ubicacion {

    constructor(
        public idUbicacion: number,
        public capa?: Capa,
        public titulo?: string,
        public descripcion?: string,
        public direccion?: string,
        public latitud?: number,
        public longitud?: number,
        public usuario?: Usuario,
        public fecha?: string
    ) { }
}
