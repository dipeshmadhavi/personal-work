import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-view-two',
  templateUrl: './view-two.component.html',
  styleUrls: ['./view-two.component.scss'],
})
export class ViewTwoComponent implements OnInit {
  @Input() public inputView: { name: string; type: string };
  public text: string;

  constructor(private readonly appService: AppService) {}

  ngOnInit() {
    this.text = this.appService.textData;
  }
}
