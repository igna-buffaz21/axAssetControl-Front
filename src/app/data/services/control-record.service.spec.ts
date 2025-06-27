import { TestBed } from '@angular/core/testing';

import { ControlRecordService } from './control-record.service';

describe('ControlRecordService', () => {
  let service: ControlRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
