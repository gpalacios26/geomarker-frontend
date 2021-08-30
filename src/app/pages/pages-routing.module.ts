import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ClaveComponent } from './clave/clave.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioFormComponent } from './usuarios/usuario-form/usuario-form.component';
import { CapasComponent } from './capas/capas.component';
import { CapaFormComponent } from './capas/capa-form/capa-form.component';
import { UbicacionesComponent } from './ubicaciones/ubicaciones.component';
import { UbicacionFormComponent } from './ubicaciones/ubicacion-form/ubicacion-form.component';
import { DispositivosComponent } from './dispositivos/dispositivos.component';
import { DispositivoFormComponent } from './dispositivos/dispositivo-form/dispositivo-form.component';

const routes: Routes = [
  {
    path: 'panel',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'clave', component: ClaveComponent },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard] },
      { path: 'usuarios/registrar', component: UsuarioFormComponent, canActivate: [AdminGuard] },
      { path: 'capas', component: CapasComponent, canActivate: [AdminGuard] },
      { path: 'capas/registrar', component: CapaFormComponent, canActivate: [AdminGuard] },
      { path: 'capas/editar/:id', component: CapaFormComponent, canActivate: [AdminGuard] },
      { path: 'ubicaciones', component: UbicacionesComponent, canActivate: [AdminGuard] },
      { path: 'ubicaciones/registrar', component: UbicacionFormComponent, canActivate: [AdminGuard] },
      { path: 'ubicaciones/editar/:id', component: UbicacionFormComponent, canActivate: [AdminGuard] },
      { path: 'dispositivos', component: DispositivosComponent, canActivate: [AdminGuard] },
      { path: 'dispositivos/registrar', component: DispositivoFormComponent, canActivate: [AdminGuard] },
      { path: 'dispositivos/editar/:id', component: DispositivoFormComponent, canActivate: [AdminGuard] },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
