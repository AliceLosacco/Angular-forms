import { HttpClient } from '@angular/common/http';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { empty, EMPTY, Observable } from 'rxjs';
import { distinct, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { FormValidations } from '../shared/form-validations';
import { Cidade } from '../shared/models/cidade';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';
import { VerificaEmailService } from './services/verifica-email.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  //formulario!: FormGroup
  //estados!: any
  estados!: EstadoBr[]
  cidades!: Cidade[]
  cargos!: any[]
  tecnologias!: any[]
  newsletterOp!: any[]

  frameworks = ['Angular', 'React', 'Vue', 'Sencha']

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super()
   }

  ngOnInit(): void {

    //this.estados = this.dropdownService.getEstadosBr()

    this.dropdownService.getEstadosBr()
      .subscribe(dados => this.estados = dados)

    this.cargos = this.dropdownService.getCargos()

    this.tecnologias = this.dropdownService.getTecnologias()

    this.newsletterOp = this.dropdownService.getNewsletter()

    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    })*/
    /*this.dropdownService.getEstadosBr()
      .subscribe((dados: EstadoBr[]) => {this.estados = dados, console.log(dados)})
    */
    this.formulario = this.formBuilder.group({
      nome: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: ["", [FormValidations.equalsTo('email')]],

      endereco: this.formBuilder.group({
        cep: ["", [Validators.required, FormValidations.cepValidator]],
        numero: ["", Validators.required],
        complemento: [""],
        rua: ["", Validators.required],
        bairro: ["", Validators.required],
        cidade: ["", Validators.required],
        estado: ["", Validators.required],
      }),

      cargo: [""],
      tecnologias: [""],
      newsletter: ['s'],
      termos: ["", Validators.pattern('true')],
      frameworks: this.buildFrameworks()

    })

    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        tap((value: any) => console.log('status do cep:', value)),
        switchMap(status => status === 'VALID' ? 
        this.cepService.consultaCEP(this.formulario.get('endereco.cep')!.value)
        : EMPTY)
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {})
   
      this.formulario.get('endereco.estado')?.valueChanges
        .pipe(
          //tap(estado => console.log('Novo estado: ', estado)),
          map(estado => this.estados.filter(e => e.sigla === estado)),
          map(estados => estados && estados.length > 0 ? estados[0].id : 0 ),
          switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
          //tap(console.log)
        )
        .subscribe(cidades => this.cidades = cidades)

      //this.dropdownService.getCidades(8).subscribe(console.log)
  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false))

    return this.formBuilder.array(values, FormValidations.checkMin(1))
  }

  submit(): void {
    
    console.log(this.formulario)

    let valueSubmit = Object.assign({}, this.formulario.value)

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v:any, i:number) => v ? this.frameworks[i] : null)
      .filter((v: any) => v !== null)
    })
    
    console.log(valueSubmit)

    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit))
      .pipe(map(res => res))
      .subscribe(dados => {
        console.log(dados)
      },
      (error: any) => alert('erro'))

  }

  consultaCEP(){
    let cep = this.formulario.get('endereco.cep')!.value

    if(cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)!
      .subscribe(dados => this.populaDadosForm(dados)) 
    }
  }

  populaDadosForm(dados: any){
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }

  resetaDadosForm(){
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' }
    this.formulario.get('cargo')?.setValue(cargo)
  }

  compararCargos(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2
  }

  setarTecnologias() {
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript', 'php'])
  }

  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? {emailInvalido: true} : null))
  }

}
