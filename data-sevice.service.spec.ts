import { TestBed } from '@angular/core/testing';

import { DataSeviceService } from './data-sevice.service';

describe('DataSeviceService', () => {
  let service: DataSeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
