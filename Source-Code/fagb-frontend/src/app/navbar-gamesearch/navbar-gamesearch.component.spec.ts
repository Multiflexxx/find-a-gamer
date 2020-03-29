import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarGamesearchComponent } from './navbar-gamesearch.component';

describe('NavbarGamesearchComponent', () => {
  let component: NavbarGamesearchComponent;
  let fixture: ComponentFixture<NavbarGamesearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarGamesearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarGamesearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
