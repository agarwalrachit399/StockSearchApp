import { NgStyle } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, tap } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgbAlertModule,NgStyle],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
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
