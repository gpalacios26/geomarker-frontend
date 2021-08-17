import { Usuario } from "./usuario.model";

export class Capa {

  constructor(
    public idCapa: number,
    public nombre?: string,
    public icono?: string,
    public usuario?: Usuario,
    public fecha?: string
  ) { }
}
