import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  playerForm: FormGroup;

  playerList = [
    {
    id:1
  },
  {
    id: 2
  },
  {
    id:3
  },
  {
    id:4
  },
  {
    id:5
  }
]
  constructor(private formBuilder: FormBuilder) { 
    
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(){
    this.playerForm = this.formBuilder.group({
      player: ['', [Validators.required]]
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.playerForm.controls[controlName].hasError(errorName);
  }
  
  
}
