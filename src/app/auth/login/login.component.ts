import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Usuario } from 'src/app/models/usuario.model';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: Usuario;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService,
    private usuarioService: UsuarioService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    if (this.usuario) this.router.navigate(['panel']);
  }

  crearFormulario() {
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';

    this.form = this.fb.group({
      usuario: ['gregpalacios26@gmail.com', [Validators.required, Validators.pattern(regExCorreo)]],
      clave: ['Sistemas26', [Validators.required, Validators.minLength(8)]],
    });
  }

  iniciarSesion() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos de acceso', 'AVISO', { duration: 2000 });
    } else {
      this.loginService.login(formulario.usuario, formulario.clave).subscribe(
        response => {
          let helper = new JwtHelperService();
          let decodedToken = helper.decodeToken(response.access_token);

          if (decodedToken) {
            localStorage.setItem(environment.TOKEN_NAME, response.access_token);
            this.usuarioService.setUsuario();

            this.snackBar.open('Acceso correcto. Iniciando la sesión...', 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel']);
            }, 1000);
          } else {
            this.snackBar.open('Los datos de acceso no son válidos', 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
