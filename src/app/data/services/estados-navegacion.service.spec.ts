import { TestBed } from '@angular/core/testing';

import { EstadosNavegacionService } from './estados-navegacion.service';

describe('EstadosNavegacionService', () => {
  let service: EstadosNavegacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadosNavegacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
