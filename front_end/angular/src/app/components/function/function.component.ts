import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import {NoteComponent} from '../note/note.component'


@Component({
  selector: 'app-function',
  standalone: true,
  imports: [MatTabsModule, NoteComponent],
  template: `
    <div>
      <mat-tab-group>
        @if(isHr){
          <mat-tab label="面试备注">
            <app-note [APPLICATION_SERVER_URL]="APPLICATION_SERVER_URL"
            [roomId]="roomId"></app-note>
          </mat-tab>
        }
      </mat-tab-group>
    </div>
  `,
  styles: ``
})
export class FunctionComponent {
  @Input() APPLICATION_SERVER_URL!: string;
  @Input() roomId!: string;
  @Input() isHr!: boolean;
}
