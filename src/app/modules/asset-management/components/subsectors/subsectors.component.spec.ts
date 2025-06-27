import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsectorsComponent } from './subsectors.component';

describe('SubsectorsComponent', () => {
  let component: SubsectorsComponent;
  let fixture: ComponentFixture<SubsectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsectorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
