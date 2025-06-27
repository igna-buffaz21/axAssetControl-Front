import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingAssetsComponent } from './missing-assets.component';

describe('MissingAssetsComponent', () => {
  let component: MissingAssetsComponent;
  let fixture: ComponentFixture<MissingAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
