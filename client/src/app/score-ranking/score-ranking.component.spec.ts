import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreRankingComponent } from './score-ranking.component';

describe('ScoreRankingComponent', () => {
  let component: ScoreRankingComponent;
  let fixture: ComponentFixture<ScoreRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
