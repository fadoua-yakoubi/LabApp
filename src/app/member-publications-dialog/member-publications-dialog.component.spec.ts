import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPublicationsDialogComponent } from './member-publications-dialog.component';

describe('MemberPublicationsDialogComponent', () => {
  let component: MemberPublicationsDialogComponent;
  let fixture: ComponentFixture<MemberPublicationsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPublicationsDialogComponent]
    });
    fixture = TestBed.createComponent(MemberPublicationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
