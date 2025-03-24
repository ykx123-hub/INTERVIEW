import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import {NoteComponent} from '../note/note.component'


@Component({
  selector: 'app-function',
  standalone: true,
  imports: [MatTabsModule, NoteComponent],
  template: `
    <div>
      <mat-tab-group>
        <mat-tab label="面试备注">
          <app-note></app-note>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: ``
})
export class FunctionComponent {
  
}
