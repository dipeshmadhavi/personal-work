import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-view-one',
  templateUrl: './view-one.component.html',
  styleUrls: ['./view-one.component.scss'],
})
export class ViewOneComponent implements OnInit {
  @Input() public inputView: { name: string; type: string };
  public textArea = '';

  constructor(private readonly appService: AppService) {}

  ngOnInit() {}

  onSubmit() {
    this.appService.textData = this.textArea;
    this.textArea = '';
  }
}
