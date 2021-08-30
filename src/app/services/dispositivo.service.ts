import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Dispositivo } from '../models/dispositivo.model';
import { GenericService } from './generic.service';

const base_url = `${environment.HOST}/api/dispositivos`;

@Injectable({
  providedIn: 'root'
})
export class DispositivoService extends GenericService<Dispositivo> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/pageable?page=${page}&size=${size}`);
  }

  exportar() {
    return this.http.get(`${base_url}/descargar`, {
      responseType: 'blob'
    });
  }
}
