import { TestBed } from '@angular/core/testing';

import { LogandregService } from './logandreg.service';

describe('LoginService', () => {
  let service: LogandregService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogandregService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
