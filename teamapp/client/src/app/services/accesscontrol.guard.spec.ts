import { TestBed } from '@angular/core/testing';

import { AccesscontrolGuard } from './accesscontrol.guard';

describe('AccesscontrolGuard', () => {
  let guard: AccesscontrolGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccesscontrolGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
