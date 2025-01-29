import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-edit-game',
  templateUrl: './popup-edit-game.component.html',
  styleUrls: ['./popup-edit-game.component.css'],
  imports : [CommonModule],
})
export class PopupEditGameComponent {
  @Input() showSettingsPopup: boolean = false;
  @Output() closePopup = new EventEmitter<void>();

  close(): void {
    this.closePopup.emit();
  }
}
