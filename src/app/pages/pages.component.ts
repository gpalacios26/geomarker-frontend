import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Menu } from '../dto/menu-dto';
import { Usuario } from '../models/usuario.model';
import { MenuService } from '../services/menu.service';
import { UsuarioService } from '../services/usuario.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  public appitems: Menu[];
  public usuario: Usuario;
  public admin: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.admin = this.usuarioService.esAdministrador();
    if(this.admin){
      this.appitems = this.menuService.getMenuAdmin();
    } else {
      this.appitems = this.menuService.getMenuUser();
    }
  }

  selectedItem(event: any) {
    this.sidenav.close();
    this.router.navigate([event.link]);
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

}
