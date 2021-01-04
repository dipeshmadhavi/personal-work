import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderMonthsComponent } from './calender-months.component';

describe('CalenderMonthsComponent', () => {
  let component: CalenderMonthsComponent;
  let fixture: ComponentFixture<CalenderMonthsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenderMonthsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
