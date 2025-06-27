import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubsectorComponent } from './add-subsector.component';

describe('AddSubsectorComponent', () => {
  let component: AddSubsectorComponent;
  let fixture: ComponentFixture<AddSubsectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubsectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubsectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
