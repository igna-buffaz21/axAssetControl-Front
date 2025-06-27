import { TestBed } from '@angular/core/testing';

import { DetailControlService } from './detail-control.service';

describe('DetailControlService', () => {
  let service: DetailControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
