import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  onSubmit(form: any){
    //console.log(this.usuario)
    console.log(form)

    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
      .pipe(map(res => res))
      .subscribe(dados => {
        console.log(dados),
        form.form.reset()
      })
  }

  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {
  }

  verficaErrorTouched(campo: any){
    return campo.errors && campo.touched
  }

  aplicaCssErro(campo: any){
    return {
      'is-invalid': this.verficaErrorTouched(campo)
    }
  }

  consultaCEP(cep: any, form: any){
    if(cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)!
      .subscribe(dados => this.populaDadosForm(dados, form))
    }
  }

  populaDadosForm(dados: any, formulario: any){
    /*formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        cep: dados.cep,
        rua: dados.logradouro,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })*/

    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }

  resetaDadosForm(formulario: any){
    formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }

}
