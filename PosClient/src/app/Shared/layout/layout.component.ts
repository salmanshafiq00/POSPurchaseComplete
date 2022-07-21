import { Component, OnInit } from '@angular/core';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [NgbAccordionConfig]
  
})
export class LayoutComponent implements OnInit {

  constructor(config: NgbAccordionConfig) { 
    config.closeOthers= true;
    config.type = "success";
  }


  
  ngOnInit(): void {
  }

}
