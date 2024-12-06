import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralizarComponent } from './centralizar.component';

describe('CentralizarComponent', () => {
  let component: CentralizarComponent;
  let fixture: ComponentFixture<CentralizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentralizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
