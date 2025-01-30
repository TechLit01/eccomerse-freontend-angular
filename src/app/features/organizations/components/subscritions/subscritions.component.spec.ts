import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscritionsComponent } from './subscritions.component';

describe('SubscritionsComponent', () => {
  let component: SubscritionsComponent;
  let fixture: ComponentFixture<SubscritionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscritionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscritionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
