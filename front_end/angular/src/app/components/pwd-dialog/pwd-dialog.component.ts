import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { verify } from 'crypto';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, PwdResponse } from 'src/app/models/api-response.model';

@Component({
  selector: 'app-pwd-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <h2 mat-dialog-title>请输入会议号和密码</h2>
    <!-- 密码输入框 -->
    <mat-dialog-content>
      <mat-form-field id="pwd-field" appearance="fill">
        <mat-label>会议号</mat-label>
        <input matInput type="roomId" [(ngModel)]="roomId" />
      </mat-form-field>
      <mat-form-field id="pwd-field" appearance="fill">
        <mat-label>密码</mat-label>
        <input matInput type="password" [(ngModel)]="password" />
      </mat-form-field>
      @if(error){
        <div>{{error}}</div>
      }
    </mat-dialog-content>

    <!-- 表单按钮 -->
    <mat-dialog-actions align="end">
      <button mat-button class="custom-button" (click)="onCancel()">取消</button>
      <button mat-raised-button class="custom-button" color="primary" (click)="onSubmit()">确定</button>
    </mat-dialog-actions>
  `,
  styleUrls: ["./component.css"]
})
export class PwdDialogComponent {
  roomId: string = '';
  password: string = '';
  error: string = '';

  constructor(
    public dialogRef: MatDialogRef<PwdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { APPLICATION_SERVER_URL: string },  // 接收父组件传来的数据
    private http: HttpClient
  ) {}

  // 会议号和密码验证逻辑
  onSubmit(): void {
    // 后端验证会议号和密码
    let body = {
      time: new Date().getTime(),
      roomId: this.roomId,
      roomPwd: this.password
    };
    
    this.http.post<PwdResponse>(this.data.APPLICATION_SERVER_URL+"room/join", body)
    .subscribe(
      (response) => {
        if (response.status === 'error'){
          alert(response.message);
        }
        else{
          this.verifyResult(response);
        }
      },
      (error) => {
        alert(error.error.message);
        alert("请求失败!")
      }
    )

    
  }

  private verifyResult(response: PwdResponse) {
    let roomName = "";
    let flag = false;
    let message = 'zz';

    flag = response.status != "error";
    message = response.message;
    if (flag){
      roomName = response.data.roomName;
    }

    // 依据验证结果做相应处理
    if (flag) {
      let verify_result = {
        flag: flag,
        roomId: this.roomId,
        roomName: roomName
      };
      this.dialogRef.close(verify_result);
    } else {
      alert(message);
      // this.error = '密码错误，请重试';
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

