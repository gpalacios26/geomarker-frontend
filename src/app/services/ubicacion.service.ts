import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ubicacion } from '../models/ubicacion.model';
import { GenericService } from './generic.service';

const base_url = `${environment.HOST}/api/ubicacion`;

@Injectable({
  providedIn: 'root'
})
export class UbicacionService extends GenericService<Ubicacion> {

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
}
