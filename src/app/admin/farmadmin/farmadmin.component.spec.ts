import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmadminComponent } from './farmadmin.component';

describe('FarmadminComponent', () => {
  let component: FarmadminComponent;
  let fixture: ComponentFixture<FarmadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
