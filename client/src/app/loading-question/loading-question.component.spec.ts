import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingQuestionComponent } from './loading-question.component';

describe('LoadingQuestionComponent', () => {
  let component: LoadingQuestionComponent;
  let fixture: ComponentFixture<LoadingQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
