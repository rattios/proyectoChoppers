import { TestBed, inject } from '@angular/core/testing';

import { RutaService } from './ruta.service';

describe('RutaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RutaService]
    });
  });

  it('should be created', inject([RutaService], (service: RutaService) => {
    expect(service).toBeTruthy();
  }));
});
