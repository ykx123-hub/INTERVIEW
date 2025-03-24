import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-note',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  template: `
    <div>
      <mat-form-field id="note-text-field">
        <textarea matInput id="note-text-area" placeholder="请输入长文本内容" rows="33"></textarea>
      </mat-form-field>
      <div style="text-align: center;">
        <button mat-button id="note-save-button">保存</button>
      </div>
    </div>
  `,
  styleUrls: ["./component.css"]
})
export class NoteComponent {

}
