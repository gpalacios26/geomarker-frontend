import { Injectable } from '@angular/core';
import { Menu } from '../dto/menu-dto';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public itemsAdmin: Menu[] = [
    {
      label: 'Geo Visor Web',
      link: '/panel/home'
    },
    {
      label: 'Mantenimientos',
      items: [
        {
          label: 'Usuarios',
          link: '/panel/usuarios',
          icon: 'groups'
        },
        {
          label: 'Capas',
          link: '/panel/capas',
          icon: 'layers'
        },
        {
          label: 'Ubicaciones',
          link: '/panel/ubicaciones',
          icon: 'add_location_alt'
        },
        {
          label: 'Dispositivos',
          link: '/panel/dispositivos',
          icon: 'explore'
        }
      ]
    },
    {
      label: 'Información Personal',
      items: [
        {
          label: 'Perfil de Usuario',
          link: '/panel/perfil',
          icon: 'account_circle'
        },
        {
          label: 'Cambiar Clave',
          link: '/panel/clave',
          icon: 'lock'
        }
      ]
    }
  ];

  public itemsUser: Menu[] = [
    {
      label: 'Geo Visor Web',
      link: '/panel/home'
    },
    {
      label: 'Información Personal',
      items: [
        {
          label: 'Perfil de Usuario',
          link: '/panel/perfil',
          icon: 'account_circle'
        },
        {
          label: 'Cambiar Clave',
          link: '/panel/clave',
          icon: 'lock'
        }
      ]
    }
  ];

  constructor() { }

  getMenuAdmin() {
    return this.itemsAdmin;
  }

  getMenuUser() {
    return this.itemsUser;
  }
}
