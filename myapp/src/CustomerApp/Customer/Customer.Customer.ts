import {
  NgForm,
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';

// Data part of your class
export class Customer {
  CustomerCode = '';
  CustomerName = '';
  CustomerAmount: number;

  // Validation part
  // Create, Connect , Consume
  formGroup: FormGroup = null;

  constructor() {
    const _builder = new FormBuilder();
    this.formGroup = _builder.group({});
    // Customer name is requried
    this.formGroup.addControl(
      'CustomerNameControl',
      new FormControl('', Validators.required)
    );
    // Customer Code is requried
    // C1009 D1009 F1009
    const validationcillection = [];
    validationcillection.push(Validators.required);
    validationcillection.push(Validators.pattern('^[A-X]{1,1}[0-9]{4,4}$'));

    this.formGroup.addControl(
      'CustomerCodeControl',
      new FormControl('', Validators.compose(validationcillection))
    );
  }
}
