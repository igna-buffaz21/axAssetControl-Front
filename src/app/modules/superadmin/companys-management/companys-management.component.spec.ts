import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanysManagementComponent } from './companys-management.component';

describe('CompanysManagementComponent', () => {
  let component: CompanysManagementComponent;
  let fixture: ComponentFixture<CompanysManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanysManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanysManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
