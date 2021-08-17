import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Rol } from 'src/app/models/rol.model';
import { Usuario } from 'src/app/models/usuario.model';
import { LoginService } from 'src/app/services/login.service';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  crearFormulario() {
    let regExLetrasEspacios = '[a-zA-ZÀ-ÿ ]+';
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';
    let regExPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}';

    this.form = this.fb.group({
      idRol: ['', Validators.required],
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      username: ['', [Validators.required, Validators.pattern(regExCorreo)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(regExPassword)]],
    });
  }

  cargarRoles() {
    this.rolService.listar().subscribe(roles => this.roles = roles);
  }

  validarCorreo() {
    let formulario = this.form.value;
    let username = formulario.username;
    if (this.form.get('username').valid) {
      this.loginService.validarCorreo(username).subscribe(
        response => {
          if (response == 1) {
            this.snackBar.open('El correo ingresado ya está registrado en el sistema', 'AVISO', { duration: 2000 });
            this.form.get('username').setErrors({ existe: true });
          }
        }
      );
    }
  }

  registrarUsuario() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let rol = new Rol(formulario.idRol);
      this.usuario = new Usuario(null, rol, formulario.nombres, formulario.apellidos, formulario.username, formulario.password);
      this.usuarioService.registrar(this.usuario).subscribe(
        response => {
          if (response) {
            this.snackBar.open('Usuario registrado correctamente', 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/usuarios']);
            }, 1000);
          } else {
            this.snackBar.open('Error al registrar el usuario', 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
