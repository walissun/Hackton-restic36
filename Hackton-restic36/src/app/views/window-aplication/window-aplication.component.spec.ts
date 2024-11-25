import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowAplicationComponent } from './window-aplication.component';

describe('WindowAplicationComponent', () => {
  let component: WindowAplicationComponent;
  let fixture: ComponentFixture<WindowAplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowAplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowAplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
