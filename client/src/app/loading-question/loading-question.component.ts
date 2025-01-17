import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../../services/Socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-question',
  templateUrl: './loading-question.component.html',
  styleUrls: ['./loading-question.component.css'],
  imports : [CommonModule]
})
export class LoadingQuestionComponent {
  @Input() roomName!: string;
  @Input() idQuestionnaire!: any;
  clientIds: string[] = [];

  constructor(private SocketService: SocketService) {}
}
