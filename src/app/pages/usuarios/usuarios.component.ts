import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuario: Usuario;
  public usuarios: Usuario[];
  public displayedColumns = ['idUsuario', 'nombres', 'apellidos', 'username', 'rol', 'estado', 'acciones'];
  public displayedColumnsMobile = ['idUsuario', 'nombres', 'apellidos', 'acciones'];
  public dataSource: MatTableDataSource<Usuario>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarUsuarios();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarUsuarios(page: number = 0, size: number = 10) {
    this.usuarioService.listarPaginado(page, size).subscribe(
      response => {
        this.usuarios = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idUsuario', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarUsuarios(e.pageIndex, e.pageSize);
  }

  cambiarEstado(usuario: Usuario) {
    if (this.usuario.username !== usuario.username) {
      const confirmDialog = this.dialog.open(DialogConfirmComponent, {
        disableClose: true,
        data: {
          titulo: 'Alerta',
          mensaje: 'Deseas cambiar el estado del usuario ' + usuario.username + ' ?'
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          let user = usuario;
          if (usuario.enabled) {
            user.enabled = false;
          } else {
            user.enabled = true;
          }
          this.usuarioService.modificarEstado(user).subscribe(
            () => {
              this.cargarUsuarios();
              this.snackBar.open('El estado fue actualizado correctamente', 'AVISO', { duration: 2000 });
            }
          );
        }
      });
    } else {
      this.snackBar.open('No puede cambiar de estado su propio usuario', 'AVISO', { duration: 2000 });
    }
  }

}
