import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string){
    //Verifica se campo cep não é nulo
    if (cep != null) {
      //regex/exp regular que tira qualquer caractere não numérico a variável
      cep = cep.replace(/\D/g, ''); 

      //Expressão regular para validar o CEP (8 digitos)
      var validaCep = /^[0-9]{8}$/

      //Valida o formato do CEP utilizando o regex declarado acima e passando o cep
      if(validaCep.test(cep)){
        return this.http.get(`https://viacep.com.br/ws/${cep}/json`)
      }
    }

    return of({})
  }
}
