import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputFieldComponent,
    multi: true
  }]
})
export class InputFieldComponent implements ControlValueAccessor {

  @Input() classeCss: any
  @Input() id!: string
  @Input() label!: string
  @Input() type = 'text'
  @Input() placeholder?: string
  @Input() control: any
  @Input() isReadOnly = false

  private innerValue: any

  get value() {
    return this.innerValue
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v
      this.onChangeCb(v) //valor foi modificado
    }
  }

  constructor() { }

  onChangeCb = (v: any) => {}
  onTouchedCb = () => {}

  writeValue(v: any): void {
    if (v !== this.innerValue) {
      this.value = v
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCb = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn
  }
  setDisabledState?(isDisabled: boolean) : void {
    this.isReadOnly = isDisabled
  }

}
