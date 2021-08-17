import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Capa } from '../models/capa.model';
import { GenericService } from './generic.service';
import { CapaFileDTO } from '../dto/capa-file-dto';

const base_url = `${environment.HOST}/api/capas`;

@Injectable({
  providedIn: 'root'
})
export class CapaService extends GenericService<Capa> {

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

  registrarDTO(dto: CapaFileDTO) {
    return this.http.post(this.url, dto);
  }

  modificarDTO(dto: CapaFileDTO) {
    return this.http.put(this.url, dto);
  }

  verIcono(name: string) {
    return this.http.get(`${base_url}/icono/${name}`, {
      responseType: 'blob'
    });
  }
}
