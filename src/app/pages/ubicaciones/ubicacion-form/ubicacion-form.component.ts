import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MouseEvent } from '@agm/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Capa } from 'src/app/models/capa.model';
import { Ubicacion } from 'src/app/models/ubicacion.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CapaService } from 'src/app/services/capa.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { GeocodeService } from 'src/app/services/geocode.service';

@Component({
  selector: 'app-ubicacion-form',
  templateUrl: './ubicacion-form.component.html',
  styleUrls: ['./ubicacion-form.component.css']
})
export class UbicacionFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public ubicacion: Ubicacion;
  public capas: Capa[];
  public id: number;
  public edicion: boolean;
  public titulo: string;
  public txtBoton: string;

  public lat: number = -12.054182;
  public lng: number = -77.0480819;
  public zoom: number = 12;
  public height: number;
  public loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private capaService: CapaService,
    private ubicacionService: UbicacionService,
    private geocodeService: GeocodeService
  ) {
    this.crearFormulario();
    this.height = window.innerHeight - 64;
  }

  onResize(event) {
    this.height = event.target.innerHeight - 64;
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarCapas();
    this.configFormulario();
  }

  get latitud() {
    return this.form.get('latitud').value;
  }

  get longitud() {
    return this.form.get('longitud').value;
  }

  crearFormulario() {
    this.form = this.fb.group({
      idCapa: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      latitud: [''],
      longitud: ['']
    });
  }

  cargarCapas() {
    this.capaService.listar().subscribe(capas => this.capas = capas);
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Ubicación";
        this.txtBoton = "Editar";
        this.cargarUbicacion();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Ubicación";
        this.txtBoton = "Registrar";
        this.setCurrentLocation();
      }
    });
  }

  cargarUbicacion() {
    this.ubicacionService.listarPorId(this.id).subscribe(
      response => {
        this.ubicacion = response;
        this.form.reset({
          idCapa: this.ubicacion.capa.idCapa,
          titulo: this.ubicacion.titulo,
          descripcion: this.ubicacion.descripcion,
          direccion: this.ubicacion.direccion,
          latitud: this.ubicacion.latitud,
          longitud: this.ubicacion.longitud
        });
        // Cambiar el zoom
        this.lat = this.ubicacion.latitud;
        this.lng = this.ubicacion.longitud;
        this.zoom = 18;
      }
    );
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 18;
        this.getAddress(this.lat, this.lng, 1);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    let latitud = $event.coords.lat;
    let longitud = $event.coords.lng;
    this.getAddress(latitud, longitud, 0);
  }

  getAddress(latitud: number, longitud: number, initGeo: number) {
    let formulario = this.form.value;
    if (initGeo == 1) { this.loader = true; }
    this.geocodeService.getAddress(latitud, longitud).subscribe(
      location => {
        if (location.address != '-') {
          // Actualizar dirección y coordenadas
          this.form.reset({
            idCapa: formulario.idCapa,
            titulo: formulario.titulo,
            descripcion: formulario.descripcion,
            direccion: location.address,
            latitud: latitud,
            longitud: longitud
          });
        } else {
          this.snackBar.open('Ocurrio un error en la consulta', 'AVISO', { duration: 2000 });
        }
        if (initGeo == 1) { this.loader = false; }
      }
    );
  }

  getCoordenadas() {
    let formulario = this.form.value;
    let direccion = formulario.direccion;
    if (direccion && direccion != '') {
      this.loader = true;
      this.geocodeService.geocodeAddress(direccion).subscribe(
        location => {
          if (location.lat != 0 && location.lng != 0) {
            // Actualizar coordenadas
            this.form.reset({
              idCapa: formulario.idCapa,
              titulo: formulario.titulo,
              descripcion: formulario.descripcion,
              direccion: location.address,
              latitud: location.lat,
              longitud: location.lng
            });
            // Cambiar el zoom
            this.lat = location.lat;
            this.lng = location.lng;
            this.zoom = 18;
          } else {
            this.snackBar.open('Ocurrio un error en la consulta', 'AVISO', { duration: 2000 });
          }
          this.loader = false;
        }
      );
    }
  }

  guardarDatos() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      let capa = new Capa(formulario.idCapa);

      let ubicacion = (this.edicion) ? this.ubicacion : new Ubicacion(null);
      ubicacion.capa = capa;
      ubicacion.titulo = formulario.titulo;
      ubicacion.descripcion = formulario.descripcion;
      ubicacion.direccion = formulario.direccion;
      ubicacion.latitud = formulario.latitud;
      ubicacion.longitud = formulario.longitud;
      ubicacion.usuario = this.usuario;

      if (this.edicion) {
        peticion = this.ubicacionService.modificar(ubicacion);
        mensaje = 'La ubicación fue actualizada correctamente';
        mensajeError = 'Error al actualizar la ubicación';
      } else {
        peticion = this.ubicacionService.registrar(ubicacion);
        mensaje = 'La ubicación fue registrada correctamente';
        mensajeError = 'Error al registrar la ubicación';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/ubicaciones']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
