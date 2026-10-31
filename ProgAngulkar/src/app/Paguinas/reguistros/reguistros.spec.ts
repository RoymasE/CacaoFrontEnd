import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reguistros } from './reguistros';

describe('Reguistros', () => {
  let component: Reguistros;
  let fixture: ComponentFixture<Reguistros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Reguistros],
    }).compileComponents();

    fixture = TestBed.createComponent(Reguistros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
