import { TestBed } from '@angular/core/testing';

import { SubsectorService } from './subsector.service';

describe('SubsectorService', () => {
  let service: SubsectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubsectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
