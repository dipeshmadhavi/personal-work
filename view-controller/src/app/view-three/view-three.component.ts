import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-view-three',
  templateUrl: './view-three.component.html',
  styleUrls: ['./view-three.component.scss'],
})
export class ViewThreeComponent implements OnInit {
  @Input() public inputView: { name: string; type: string };

  constructor() {}

  ngOnInit() {}
}
