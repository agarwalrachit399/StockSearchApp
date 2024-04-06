import { Component } from '@angular/core';
import { CompanydescComponent } from '../companydesc/companydesc.component';
import { TabsComponent } from '../tabs/tabs.component';
import { SearchformComponent } from '../searchform/searchform.component';
import { FormvalService } from '../services/formval.service';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-resultform',
  standalone: true,
  imports: [CompanydescComponent,TabsComponent,SearchformComponent,MatProgressSpinnerModule,NgIf,CommonModule],
  templateUrl: './resultform.component.html',
  styleUrl: './resultform.component.css'
})
export class ResultformComponent {
  name: string = '';
  isLoadingData : boolean = false

  constructor(private shareFormVal: FormvalService,
    private route : ActivatedRoute,
    ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.name = params['id'];
      this.shareFormVal.setSearchValue(this.name);
    });
  }
}
