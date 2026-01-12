import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteToolDialogComponent } from './delete-tool-dialog.component';

describe('DeleteToolDialogComponent', () => {
  let component: DeleteToolDialogComponent;
  let fixture: ComponentFixture<DeleteToolDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteToolDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteToolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
