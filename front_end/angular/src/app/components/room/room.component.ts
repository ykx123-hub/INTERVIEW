import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';


import {
	ParticipantService,
	OpenViduComponentsModule,
	PanelStatusInfo,
	PanelService,
} from 'openvidu-components-angular';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import {FunctionComponent} from '../function/function.component'


@Component({
	selector: 'app-room',
	template: `
		<ov-videoconference
			[token]="token"
			[livekitUrl]="LIVEKIT_URL"
			(onTokenRequested)="onTokenRequested($event)"
		>
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

			<!-- Additional Toolbar Buttons -->
            <div *ovToolbarAdditionalPanelButtons style="text-align: center;">
                <button mat-icon-button (click)="toggleMyPanel('my-panel1')">
                    <mat-icon>apps</mat-icon>
                </button>
            </div>

            <!-- Additional Panels -->
            <div *ovAdditionalPanels id="my-panels">
                @if (showExternalPanel) {
                <div id="my-panel1">
                    <!-- <h2>NEW PANEL 1</h2>
                    <p>This is my new additional panel</p> -->
					<app-function></app-function>
                </div>
                } 
            </div>
		</ov-videoconference>
	`,
	styles: [],
	standalone: true,
	imports: [OpenViduComponentsModule, MatIconButton, MatIcon,  MatTooltipModule, FunctionComponent],
})
export class RoomComponent {
	// For local development, leave these variables empty
	// For production, configure them with correct URLs depending on your deployment

	APPLICATION_SERVER_URL = '';
	LIVEKIT_URL = '';

	// User Identifier
	isAdmin = true;

	// Recording Control 
	isRecording = false;  // 标识当前是否处于录制状态
	currentRecordingId?: string;  // 记录当前录制的ID

	// Flags to control the visibility of external panels
	showExternalPanel: boolean = false; 
	showExternalPanel2: boolean = false;

	// The name of the room for the video conference.
	roomName = 'JOB';

	// The token used to authenticate the user in the video conference.
	token!: string;

	constructor(
		private httpClient: HttpClient,
		private participantService: ParticipantService,
		private panelService: PanelService
	) {
		this.configureUrls();
	}

	ngOnInit() {
		this.subscribeToPanelToggling();
	}

	private configureUrls() {
		// If APPLICATION_SERVER_URL is not configured, use default value from local development
		if (!this.APPLICATION_SERVER_URL) {
			if (window.location.hostname === 'localhost') {
				this.APPLICATION_SERVER_URL = 'http://localhost:6080/';
			} else {
				this.APPLICATION_SERVER_URL =
					'https://' + window.location.hostname + ':6443/';
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
		const { token } = await this.getToken(this.roomName, participantName);
		this.token = token;
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

	// Retrieves a token from the server to authenticate the user.
	getToken(roomName: string, participantName: string): Promise<any> {
		try {
			return lastValueFrom(
				this.httpClient.post<any>(this.APPLICATION_SERVER_URL + 'token', {
					roomName,
					participantName,
				})
			);
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
