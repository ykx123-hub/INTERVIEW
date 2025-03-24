import { Component } from '@angular/core';
import { RoomComponent } from './components/room/room.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RoomComponent],
  template: `
    <div>
        <app-room></app-room>
    </div>
  `,
  styles: []
})
export class AppComponent {

}
