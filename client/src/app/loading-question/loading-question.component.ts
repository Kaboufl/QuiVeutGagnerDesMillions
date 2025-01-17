import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../../services/Socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-question',
  templateUrl: './loading-question.component.html',
  styleUrls: ['./loading-question.component.css'],
  imports : [CommonModule]
})
export class LoadingQuestionComponent implements OnInit {
  @Input() roomName!: string;
  @Input() idQuestionnaire!: any;
  clientIds: string[] = [];

  constructor(private SocketService: SocketService) {}

  ngOnInit() {
    this.SocketService.listenRoomData().subscribe((data: any) => {
      console.log('Room data received:', data);
      this.clientIds = data.clientIds;
    });
  }
}
