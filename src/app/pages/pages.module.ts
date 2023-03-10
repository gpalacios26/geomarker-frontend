import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material/material.module';
import { DialogsModule } from '../dialogs/dialogs.module';

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

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    PerfilComponent,
    ClaveComponent,
    UsuariosComponent,
    UsuarioFormComponent,
    CapasComponent,
    CapaFormComponent,
    UbicacionesComponent,
    UbicacionFormComponent,
    DispositivosComponent,
    DispositivoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMaterialMultilevelMenuModule,
    AppRoutingModule,
    MaterialModule,
    DialogsModule,
    AgmCoreModule.forRoot({
      apiKey: ''
    }),
    AgmJsMarkerClustererModule
  ],
  exports: [
    PagesComponent,
    HomeComponent,
    PerfilComponent,
    ClaveComponent,
    UsuariosComponent,
    UsuarioFormComponent,
    CapasComponent,
    CapaFormComponent,
    UbicacionesComponent,
    UbicacionFormComponent,
    DispositivosComponent,
    DispositivoFormComponent
  ]
})
export class PagesModule { }
