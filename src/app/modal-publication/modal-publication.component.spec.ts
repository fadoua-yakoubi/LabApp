import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPublicationComponent } from './modal-publication.component';

describe('ModalPublicationComponent', () => {
  let component: ModalPublicationComponent;
  let fixture: ComponentFixture<ModalPublicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPublicationComponent]
    });
    fixture = TestBed.createComponent(ModalPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
