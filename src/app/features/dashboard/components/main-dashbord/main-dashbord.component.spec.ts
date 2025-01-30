import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDashbordComponent } from './main-dashbord.component';

describe('MainDashbordComponent', () => {
  let component: MainDashbordComponent;
  let fixture: ComponentFixture<MainDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainDashbordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
