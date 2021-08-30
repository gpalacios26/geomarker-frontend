import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Dispositivo } from 'src/app/models/dispositivo.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DispositivoService } from 'src/app/services/dispositivo.service';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-dispositivo-form',
  templateUrl: './dispositivo-form.component.html',
  styleUrls: ['./dispositivo-form.component.css']
})
export class DispositivoFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public dispositivo: Dispositivo;
  public id: number;
  public edicion: boolean;
  public titulo: string;
  public txtBoton: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private dispositivoService: DispositivoService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.configFormulario();
  }

  crearFormulario() {
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';

    this.form = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      correo: ['', [Validators.required, Validators.pattern(regExCorreo)]],
      token: [nanoid(10), Validators.required]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Dispositivo";
        this.txtBoton = "Editar";
        this.cargarDispositivo();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Dispositivo";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarDispositivo() {
    this.dispositivoService.listarPorId(this.id).subscribe(
      response => {
        this.dispositivo = response;
        this.form.reset({
          codigo: this.dispositivo.codigo,
          nombre: this.dispositivo.nombre,
          descripcion: this.dispositivo.descripcion,
          correo: this.dispositivo.correo,
          token: this.dispositivo.token
        });
      }
    );
  }

  getNewToken() {
    let formulario = this.form.value;
    this.form.reset({
      codigo: formulario.codigo,
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      correo: formulario.correo,
      token: nanoid(10)
    });
  }

  guardarDatos() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      let dispositivo = (this.edicion) ? this.dispositivo : new Dispositivo(null);
      dispositivo.codigo = formulario.codigo;
      dispositivo.nombre = formulario.nombre;
      dispositivo.descripcion = formulario.descripcion;
      dispositivo.correo = formulario.correo;
      dispositivo.token = formulario.token;
      dispositivo.usuario = this.usuario;

      if (this.edicion) {
        peticion = this.dispositivoService.modificar(dispositivo);
        mensaje = 'El dispositivo fue actualizado correctamente';
        mensajeError = 'Error al actualizar el dispositivo';
      } else {
        peticion = this.dispositivoService.registrar(dispositivo);
        mensaje = 'El dispositivo fue registrado correctamente';
        mensajeError = 'Error al registrar el dispositivo';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/dispositivos']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
