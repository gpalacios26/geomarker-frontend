import { Usuario } from "./usuario.model";

export class Dispositivo {

  constructor(
    public idDispositivo: number,
    public codigo?: string,
    public nombre?: string,
    public descripcion?: string,
    public correo?: string,
    public token?: string,
    public usuario?: Usuario,
    public fecha?: string
  ) { }
}
