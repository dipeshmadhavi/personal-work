import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstModuleComponent } from './first-module.component';

describe('FirstModuleComponent', () => {
  let component: FirstModuleComponent;
  let fixture: ComponentFixture<FirstModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
