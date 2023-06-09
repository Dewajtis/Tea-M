import { TestBed } from '@angular/core/testing';

import { WorkwhdataService } from './workwhdata.service';

describe('WorkwhdataService', () => {
  let service: WorkwhdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkwhdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
