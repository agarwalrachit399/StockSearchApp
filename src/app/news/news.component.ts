import { Component, Input, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company, NewsDesc } from '../../types';
import { SharingServiceService } from '../services/sharing-service.service';
import { CommonModule, NgFor } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-news-modal',
	standalone: true,
  imports: [CommonModule,NgFor],
	templateUrl: './news-modal.component.html',
  styleUrl: './news-modal.components.css'
})
export class NewsModalComponent {
	activeModal = inject(NgbActiveModal);

  @Input() source: string ='';
	@Input() date: string ='';
  @Input() headline: string ='';
  @Input() summary: string ='';
  @Input() link: string ='';
}


@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  private subscription: Subscription;
  private modalService = inject(NgbModal);
  Data!: Company
  news : NewsDesc[] = []
 constructor(private SharingService : SharingServiceService) {
  this.subscription = this.SharingService.data$.subscribe(data => {
    this.Data = data;
    this.news = this.Data.news.filter(obj => {
      return Object.values(obj).every(value => value !== undefined && value !== null && value !== "");
  });
  })
}
open(id:number) {
  const modalRef = this.modalService.open(NewsModalComponent);
  modalRef.componentInstance.source = this.news.find(obj=>obj.id==id)!.source
  modalRef.componentInstance.date = this.formatUnixTimestamp(this.news.find(obj=>obj.id==id)!.datetime)
  modalRef.componentInstance.headline = this.news.find(obj=>obj.id==id)!.headline
  modalRef.componentInstance.summary = this.news.find(obj=>obj.id==id)!.summary
  modalRef.componentInstance.link = this.news.find(obj=>obj.id==id)!.url
}

public formatUnixTimestamp(timestamp: number) {
  
  const date = new Date(timestamp * 1000);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  const formattedDate = `${month} ${day}, ${year}`;
  
  return formattedDate;
}

}
