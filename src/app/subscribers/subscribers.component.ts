import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit{

  subArray: any [] = [];

  constructor(private subService: SubscribersService) {}

  ngOnInit(): void {
      this.subService.loadSubData().subscribe(val => {
        this.subArray = val;
      })
  }

  onDelete(id: any) {
    this.subService.deleteSubData(id);
  }


}
