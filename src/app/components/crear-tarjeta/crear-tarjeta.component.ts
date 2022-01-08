import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = 'Agregar Tarjeta';
  id: string | undefined;

  constructor(private fb: FormBuilder,
              private _tarjetaService: TarjetaService,
              private _toastr: ToastrService
              ) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    })
   }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe( data => {
      this.titulo = 'Editar Tarjeta';
      this.id = data.id;
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      });
      console.log(data)
    })
  }

  guardarTarjeta(){
    
    if(this.id === undefined){
      // creamos una nueva tarjeta
      this.agregarTarjeta();
    } else {
      // editamos una ta((rjeta
      this.editarTarjeta(this.id);
    }

  }

  agregarTarjeta(){
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };

    this.loading = true;
    this._tarjetaService.guardarTarjeta(TARJETA).then(() => {
      this.loading = false;
      this._toastr.success("La tarjeta fue registrada con exito.", "Tarjeta Registrada");
      this.form.reset();
    }, error => {
      this.loading = false;
      this._toastr.error("Opps... ocurrio un error.", "Error");
      console.log(error)
    });
  }

  editarTarjeta(id: string){
    const TARJETA: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion: new Date(),
    };

    this.loading = true;
    this._tarjetaService.editarTarjeta(id, TARJETA).then(() => {
      this.loading = false;
      this.titulo = "Agregar Tarjeta";
      this.form.reset();
      this.id = undefined;
      this._toastr.info('La tarjeta fue actualizada con exito!', 'Registro Actualizado');
    }, error => {
      this.loading= false;      
      this._toastr.error("Opps... ocurrio un error.", "Error");
      console.log(error)
    });
  }

}
