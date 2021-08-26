import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormValidations {

    static cepValidator(control: FormControl) {
        const cep = control.value

        if(cep && cep !== '') {
            const validacep = /^\d{5}\d{3}$/
            return validacep.test(cep) ? null : { cepInvalido : true }
        }
        return null
    }

    static equalsTo (otherField: string) {
        const validator = (formControl: FormControl) => {
            if (otherField == null) {
                throw new Error('É necessário informar um campo.')
            }

            if(!formControl.root || !(<FormGroup>formControl.root).controls) {
                return null
            }

            const field = (<FormGroup>formControl.root).get(otherField)

            if (!field) {
                throw new Error('É necessário informar um campo válido.')
            }

            if(field.value !== formControl.value) {
                return { equalsTo : otherField }
            }

            return null
        }
        return validator
    }

    static checkMin(min = 1): ValidatorFn {
        return (control: AbstractControl) : ValidationErrors | null => {
      
          const values = control.value
          let totalChecked = 0;
          for (let i = 0; i < values.length; i++) {
            if (values[i]) {
              totalChecked += 1;
            }
          }
          return totalChecked >= min ? null : { required: true };
        }
      }

    static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {
        const config: any = {
            'required': `${fieldName} é obrigatório`,
            'minlength': `${fieldName} precisa ter ${validatorValue.requiredLength} no mínimo caracteres`,
            'maxlength': `${fieldName} precisa ter ${validatorValue.requiredLength} no máximo caracteres`,
            'cepInvalido': 'CEP inválido',
            'emailInvalido': 'Email já cadastrado!',
            'equalsTo': 'Campos não são iguais'
        }

        return config[validatorName]
    }

}

