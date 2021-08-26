import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<br>'
})
export abstract class BaseFormComponent implements OnInit {

  formulario!: FormGroup

  constructor() { }

  ngOnInit(): void {
  }

  abstract submit(): any

  onSubmit() {
    if (this.formulario.valid) {
      this.submit()
    } else {
      this.varificaValidacoesForm(this.formulario)
      }
  }

  varificaValidacoesForm(formGroup: FormGroup | FormArray){
    Object.keys(formGroup.controls).forEach( campo => {
      console.log(campo)
      const controle = formGroup.get(campo)   
      controle!.markAsTouched()
      controle!.markAsDirty()
      if (controle instanceof FormGroup || controle instanceof FormArray){
        this.varificaValidacoesForm(controle)
      }
    })
  }

  resetar(){
    this.formulario.reset()
  }

  verficaValidTouched(campo: string){
    return !this.formulario.get(campo)!.valid && 
    this.formulario.get(campo)!.touched 
  }

  verificaRequired(campo: string) {
    return this.formulario.get(campo)!.hasError('required') &&
      this.formulario.get(campo)!.touched 
  }

  aplicaCssErro(campo: string){
    return {
      'is-invalid': this.verficaValidTouched(campo)
    }
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email')
    if (campoEmail!.errors){
      return campoEmail!.errors!['email'] && campoEmail!.touched
    }
  }

  getFrameworksControls() {
    return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
  }
}
