import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEvtDialogComponent } from './delete-evt-dialog.component';

describe('DeleteEvtDialogComponent', () => {
  let component: DeleteEvtDialogComponent;
  let fixture: ComponentFixture<DeleteEvtDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteEvtDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteEvtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
