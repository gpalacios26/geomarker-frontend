import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Capa } from 'src/app/models/capa.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CapaService } from 'src/app/services/capa.service';
import { FileDTO } from 'src/app/dto/file-dto';
import { CapaFileDTO } from 'src/app/dto/capa-file-dto';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-capa-form',
  templateUrl: './capa-form.component.html',
  styleUrls: ['./capa-form.component.css']
})
export class CapaFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public capa: Capa;
  public id: number;
  public edicion: boolean;
  public titulo: string;
  public txtBoton: string;
  public fileDTO: FileDTO;
  public imageDefault: string;
  public imageCapa: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private capaService: CapaService,
    private sanitization: DomSanitizer
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.imageDefault = 'assets/images/no-image.png';
    this.configFormulario();
  }

  crearFormulario() {
    this.form = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Capa";
        this.txtBoton = "Editar";
        this.cargarCapa();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Capa";
        this.txtBoton = "Registrar";
        this.mostrarIcono();
      }
    });
  }

  cargarCapa() {
    this.capaService.listarPorId(this.id).subscribe(
      response => {
        this.capa = response;
        this.form.reset({
          nombre: this.capa.nombre
        });
        this.mostrarIcono();
      }
    );
  }

  handleUpload(event: any) {
    let file = event.target.files[0];
    let fileSize = file.size;
    if (fileSize <= 2097152) {
      let fileName = file.name;
      let fileArray = fileName.split(".");
      let fileExtension = fileArray[1];
      if (fileExtension.toLowerCase() == 'jpg' || fileExtension.toLowerCase() == 'png') {
        this.cargarFile(file, fileExtension, fileName);
      } else {
        event.srcElement.value = null;
        this.snackBar.open('Los formatos aceptados son: JPG - PNG', 'AVISO', { duration: 2000 });
      }
    } else {
      event.srcElement.value = null;
      this.snackBar.open('Los archivos deben tener un peso máximo de 2MB', 'AVISO', { duration: 2000 });
    }
  }

  mostrarIcono() {
    if (this.capa && this.capa.icono) {
      this.capaService.verIcono(this.capa.icono).subscribe(
        response => {
          let fileName = this.capa.icono;
          let fileArray = fileName.split(".");
          let fileExtension = fileArray[1];
          this.cargarFile(response, fileExtension, fileName);
        }
      );
    } else {
      this.imageCapa = this.imageDefault;
    }
  }

  cargarFile(file: any, fileExtension: string, fileName: string) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let dataURLFile = (reader.result).toString();
      let base64Result = dataURLFile.split(',')[1];
      //
      let fileUpload = new FileDTO();
      fileUpload.fileContentBase64 = base64Result;
      fileUpload.fileFormat = fileExtension;
      fileUpload.fileName = fileName;
      this.fileDTO = fileUpload;
      this.imageCapa = this.sanitization.bypassSecurityTrustResourceUrl(dataURLFile);
    };
  }

  guardarDatos() {
    let formulario = this.form.value;
    if (this.form.invalid || !this.fileDTO) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      let capa = (this.edicion) ? this.capa : new Capa(null);
      capa.nombre = formulario.nombre;
      capa.usuario = this.usuario;

      let capaFileDTO = new CapaFileDTO();
      capaFileDTO.capa = capa;
      capaFileDTO.fileDTO = this.fileDTO;

      if (this.edicion) {
        peticion = this.capaService.modificarDTO(capaFileDTO);
        mensaje = 'La capa fue actualizada correctamente';
        mensajeError = 'Error al actualizar la capa';
      } else {
        peticion = this.capaService.registrarDTO(capaFileDTO);
        mensaje = 'La capa fue registrada correctamente';
        mensajeError = 'Error al registrar la capa';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/capas']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
