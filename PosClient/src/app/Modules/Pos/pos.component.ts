import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  submit(form : NgForm){
    
  }

  decrement_qty(){

  }

  qty : number = 5;

  increment_qty(){

  }

}
