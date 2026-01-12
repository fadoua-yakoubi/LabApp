import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalToolComponent } from './modal-tool.component';

describe('ModalToolComponent', () => {
  let component: ModalToolComponent;
  let fixture: ComponentFixture<ModalToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalToolComponent]
    });
    fixture = TestBed.createComponent(ModalToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
