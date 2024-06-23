import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminmenuComponent } from './adminmenu.component';
import { RouterModule } from '@angular/router';

describe('AdminmenuComponent', () => {
  let component: AdminmenuComponent;
  let fixture: ComponentFixture<AdminmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminmenuComponent, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isMenuOpen initially set to false', () => {
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should toggle isMenuOpen and body class when toggleAdminMenu is called', () => {
    const initialMenuState = component.isMenuOpen;
    component.toggleAdminMenu();
    expect(component.isMenuOpen).toBe(!initialMenuState);
    expect(document.body.classList.contains('showAdmin')).toBe(!initialMenuState);

    component.toggleAdminMenu();
    expect(component.isMenuOpen).toBe(initialMenuState);
    expect(document.body.classList.contains('showAdmin')).toBe(initialMenuState);
  });
});
