import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Capa } from 'src/app/models/capa.model';
import { Ubicacion } from 'src/app/models/ubicacion.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CapaService } from 'src/app/services/capa.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public lat: number = -12.054182;
  public lng: number = -77.0480819;
  public zoom: number = 12;
  public height: number;
  public loader: boolean = false;

  public usuario: Usuario;
  public userLocation: boolean = false;
  public capas: Capa[];
  public ubicaciones: Ubicacion[];

  public divLayers: boolean = true;
  public infoWindowOpened = null;
  public previous_info_window = null;
  public desactivados: Array<number> = [];
  public image_url: string = `${environment.HOST}/api/capas/icono/`;

  constructor(
    private usuarioService: UsuarioService,
    private capaService: CapaService,
    private ubicacionService: UbicacionService
  ) {
    this.height = window.innerHeight - 64;
  }

  onResize(event) {
    this.height = event.target.innerHeight - 64;
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.setCurrentLocation();
    this.cargarCapas();
    this.cargarUbicaciones();
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.userLocation = true;
      });
    }
  }

  cargarCapas() {
    this.capaService.listar().subscribe(capas => this.capas = capas);
  }

  cargarUbicaciones() {
    this.ubicacionService.listar().subscribe(ubicaciones => this.ubicaciones = ubicaciones);
  }

  closeWindow() {
    if (this.previous_info_window != null) {
      this.previous_info_window.close();
    }
  }

  selectMarker(infoWindow: any) {
    if (this.previous_info_window == null) {
      this.previous_info_window = infoWindow;
    } else {
      this.infoWindowOpened = infoWindow;
      this.previous_info_window.close();
    }
    this.previous_info_window = infoWindow;
  }

  toogleDiv() {
    if (this.divLayers) {
      this.divLayers = false;
    } else {
      this.divLayers = true;
    }
  }

  changeLayerValue(event: any) {
    this.infoWindowOpened = null;
    this.previous_info_window = null;

    let checked = event.checked;
    let value = event.source.value;

    if (checked) {
      let index = this.desactivados.indexOf(value);
      if (index > -1) {
        this.desactivados.splice(index, 1);
      }
    } else {
      this.desactivados.push(value);
    }

    this.ubicacionService.listar().subscribe(ubicaciones => {
      let ubicacionesActivas;
      if (this.desactivados.length > 0) {
        ubicacionesActivas = ubicaciones.filter(ubicacion => !(this.desactivados.includes(ubicacion.capa.idCapa)))
      } else {
        ubicacionesActivas = ubicaciones;
      }
      this.ubicaciones = ubicacionesActivas;
    });
  }

}
