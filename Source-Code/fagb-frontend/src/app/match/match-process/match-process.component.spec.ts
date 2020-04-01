import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchProcessComponent } from './match-process.component';

describe('MatchProcessComponent', () => {
  let component: MatchProcessComponent;
  let fixture: ComponentFixture<MatchProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
