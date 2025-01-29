import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditGameComponent } from './popup-edit-game.component';

describe('PopupEditGameComponent', () => {
  let component: PopupEditGameComponent;
  let fixture: ComponentFixture<PopupEditGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupEditGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupEditGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
