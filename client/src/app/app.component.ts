import { Component } from '@angular/core';
import { DataService } from '../../services/Data.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  imports: [RouterOutlet],
})
export class AppComponent {
  title = 'client';  
}
