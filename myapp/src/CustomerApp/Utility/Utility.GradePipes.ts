import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'Grading' })
export class GradePipes implements PipeTransform {
  transform(value: number): string {
    if (value > 100) {
      if (value > 500) {
        return 'Gold';
      } else {
        return 'Silver';
      }
    } else {
      return 'Bronze';
    }
  }
}
