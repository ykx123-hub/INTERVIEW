import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NoteTextResponse } from 'src/app/models/api-response.model';
import { ApiResponse } from 'src/app/models/api-response.model';



@Component({
  selector: 'app-note',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <div>
      <mat-form-field id="note-text-field">
        <textarea matInput id="note-text-area" [(ngModel)]="textValue" placeholder="请输入长文本内容" rows="33"></textarea>
      </mat-form-field>
      <div style="text-align: center;">
        <button mat-button id="note-save-button" (click)="onSubmit()">保存</button>
      </div>
    </div>
  `,
  styleUrls: ["./component.css"]
})
export class NoteComponent {
  @Input() APPLICATION_SERVER_URL!: string;
  @Input() roomId!: string;
  textValue: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    //获取备注内容
    this.http.get<NoteTextResponse>(this.APPLICATION_SERVER_URL + `room/function/get_note/${this.roomId}`)
    .subscribe(
      {
        next: (response: NoteTextResponse) => {
          this.textValue = response.data.note;
        },
        error: (err) => {
          console.error('请求失败：', err);
        }
      }
    )
  }


  onSubmit(): void{
    // 向后端发送备注内容
    let body = {
      roomId: this.roomId,
      text: this.textValue
    };
    this.http.post<ApiResponse<null>>(this.APPLICATION_SERVER_URL + "room/function/save_note", body)
    .subscribe(
      {
        next: (response) => {
          alert(response.message);
        },
        error: (err) => {
          console.error('请求失败：', err);
        }
      }
    )
  }
}
