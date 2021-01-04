import { FormArray } from '@angular/forms';

export class ValidationService {
  static minimumOneSelection(fa: FormArray) {
    let valid = false;

    // for (let x = 0; x < fa.length; x += 1) {
    //   if (fa.at(x).value.selected) {
    //     valid = true;
    //     break;
    //   }
    // }
    if (fa.length > 0) {
      valid = true;
    }

    return valid
      ? null
      : {
          multipleCheckboxRequireOne: true,
        };
  }
}
