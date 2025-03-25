import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';


import {
	ParticipantService,
	OpenViduComponentsModule,
	PanelStatusInfo,
	PanelService,
} from 'openvidu-components-angular';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import {FunctionComponent} from './components/function/function.component'
import { PwdDialogComponent } from './components/pwd-dialog/pwd-dialog.component';


@Component({
	selector: 'app-root',
	template: `
		@if(!isAuthorized){
			<div></div>
		}
		@else{
		<!-- 会议界面 -->
		<ov-videoconference
			[token]="token"
			[livekitUrl]="LIVEKIT_URL"
			(onTokenRequested)="onTokenRequested($event)"
			[toolbarDisplayLogo]="false"
			[toolbarActivitiesPanelButton]="false"
		>
			<!-- 会议录制按钮 -->
			<div *ovToolbarAdditionalButtons style="text-align: center;">
				<button mat-icon-button (click)="toggleRecording()" [matTooltip]="isRecording ? '停止录制' : '开始录制'" matTooltipPosition="above">
      			<!-- 根据录制状态，动态展示不同图标 -->
					@if (isRecording){
						<mat-icon class="red-icon">stop</mat-icon>
					}
      				@else {
						<mat-icon>fiber_manual_record</mat-icon>
					}
    			</button>
			</div>

			<!-- 面试功能按钮 -->
            <div *ovToolbarAdditionalPanelButtons style="text-align: center;">
                <button mat-icon-button (click)="toggleMyPanel('my-panel1')">
                    <mat-icon>apps</mat-icon>
                </button>
            </div>

            <!-- 面试功能面板 -->
            <div *ovAdditionalPanels id="my-panels">
                @if (showExternalPanel) {
                <div id="my-panel1">
					<app-function [APPLICATION_SERVER_URL]="APPLICATION_SERVER_URL"
					[roomId]="roomId"
					[isHr]="isHr"></app-function>
                </div>
                } 
            </div>
		</ov-videoconference>}
	`,
	styles: [],
	standalone: true,
	imports: [OpenViduComponentsModule, MatIconButton, MatIcon,  MatTooltipModule, FunctionComponent, MatDialogModule],
})
export class AppComponent {
	// For local development, leave these variables empty
	// For production, configure them with correct URLs depending on your deployment

	APPLICATION_SERVER_URL = 'http://10.63.189.110:6080/';
	LIVEKIT_URL = 'ws://10.63.189.110:7880/';

	// 入会权限验证
	isAuthorized: boolean = false;

	// User Identifier
	isAdmin: boolean = true;
	isHr: boolean = true;

	// 会议录制 
	isRecording: boolean = false;  // 标识当前是否处于录制状态
	currentRecordingId?: string;  // 记录当前录制的ID

	// Flags to control the visibility of external panels
	showExternalPanel: boolean = false; 

	// The information of the room for the video conference.
	roomName = '';
	roomId = ""

	// The token used to authenticate the user in the video conference.
	token!: string;

	/* function-component */
	constructor(
		private httpClient: HttpClient,
		private participantService: ParticipantService,
		private panelService: PanelService,
		private dialog: MatDialog
	) {
		this.configureUrls();
	}

	ngOnInit() {
		this.openPasswordDialog();
		this.subscribeToPanelToggling();
	}

	private configureUrls() {
		// If APPLICATION_SERVER_URL is not configured, use default value from local development
		if (!this.APPLICATION_SERVER_URL) {
			if (window.location.hostname === 'localhost') {
				this.APPLICATION_SERVER_URL = 'http://localhost:6080/';
			} else {
				this.APPLICATION_SERVER_URL = 'https://' + window.location.hostname + ':6443/';
			}
		}

		// If LIVEKIT_URL is not configured, use default value from local development
		if (!this.LIVEKIT_URL) {
			if (window.location.hostname === 'localhost') {
				this.LIVEKIT_URL = 'ws://localhost:7880/';
			} else {
				this.LIVEKIT_URL = 'wss://' + window.location.hostname + ':7443/';
			}
		}
	}

	// Called when the token is requested.
	async onTokenRequested(participantName: string) {
		const token  = await this.getToken(this.roomName, participantName);
		this.token = token;
		alert(this.token);
	}

	// Toggles the camera on/off.
	async toggleVideo() {
		const isCameraEnabled = this.participantService.isMyCameraEnabled();
		await this.participantService.setCameraEnabled(!isCameraEnabled);
	}

	// Toggles the microphone on/off.
	async toggleAudio() {
		const isMicrophoneEnabled = this.participantService.isMyMicrophoneEnabled();
		await this.participantService.setMicrophoneEnabled(!isMicrophoneEnabled);
	}

	// Toggles the recording on/off
	async toggleRecording(): Promise<void> {
		if (this.isRecording){
			this.isRecording = false;
		}
		else {
			this.isRecording = true;
		}
		// if (!this.isRecording) {
		//   // 开始录制
		//   this.currentRecordingId = await this.startRecording();
		//   this.isRecording = true;
		// } else {
		//   // 停止录制
		//   if (this.currentRecordingId) {
		// 	await this.stopRecording(this.currentRecordingId);
		//   }
		//   this.isRecording = false;
		//   this.currentRecordingId = undefined;
		// }
	  }

	// Subscribe to panel toggling events
	subscribeToPanelToggling() {
		this.panelService.panelStatusObs.subscribe((ev: PanelStatusInfo) => { 
		  this.showExternalPanel = ev.isOpened && ev.panelType === 'my-panel1';
		});
	  }
	
	// Toggle the visibility of external panels
	toggleMyPanel(type: string) { 
	this.panelService.togglePanel(type);
	}

	// 打开入会验证对话框
	// 自动打开密码验证的 Dialog
	openPasswordDialog(): void {
		const dialogRef = this.dialog.open(PwdDialogComponent, {
		  width: '400px',
		  data: { APPLICATION_SERVER_URL: this.APPLICATION_SERVER_URL }
		});
	
		dialogRef.afterClosed().subscribe(result => {
		  if (result.flag) {
			// 密码验证成功
			this.roomId = result.roomId;
			this.roomName = result.roomName;
			this.isAuthorized = true;
		  } else {
			// 密码验证失败或用户取消，可以根据需要做处理
			console.log('密码验证未通过或被取消');
		  }
		});
	  }

	// Retrieves a token from the server to authenticate the user.
	async getToken(roomName: string, participantName: string): Promise<string> {
		try {
			const res = await lastValueFrom(
				this.httpClient.post<any>(this.APPLICATION_SERVER_URL + 'room/token', {
					roomName,
					participantName,
				})
			);
			return res.data.token;
			
		} catch (error: any) {
			if (error.status === 404) {
				throw {
					status: error.status,
					message: 'Cannot connect with backend. ' + error.url + ' not found',
				};
			}
			throw error;
		}
	}
}
