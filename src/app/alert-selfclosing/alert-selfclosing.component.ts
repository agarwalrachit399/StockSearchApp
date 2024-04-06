import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgStyle } from '@angular/common';

@Component({
	selector: 'ngbd-alert-selfclosing',
	standalone: true,
	imports: [NgbAlertModule,NgStyle],
	templateUrl: './alert-selfclosing.component.html',
})
export class NgbdAlertSelfclosing implements OnInit {
	@Input() message! :string 
	@Input() type! : string
	staticAlertClosed = false;
	

	@ViewChild('staticAlert', { static: false })
  staticAlert!: NgbAlert;
  

	constructor() {
	}
	ngOnInit(): void {
		 setTimeout(() => this.staticAlert.close(), 5000);
		
	}

	}

