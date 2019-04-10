import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component/public_api';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  frm: FormGroup;
  submitted = false;
  
  data: Select2Data = [
    { value: 'AK', label: 'Alaska' },
    { value: 'HI', label: 'Hawaii', disabled: true },
    { value: 'CA', label: 'California' },
    { value: 'NV', label: 'Nevada' },
    { value: 'OR', label: 'Oregon' },
    { value: 'WA', label: 'Washington' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'CO', label: 'Colorado' },
    { value: 'ID', label: 'Idaho' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'UT', label: 'Utah' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TX', label: 'Texas' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'IN', label: 'Indiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'OH', label: 'Ohio' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WV', label: 'West Virginia' }
];

  constructor() { }

  ngOnInit() {

    this.frm = new FormGroup({
      adscripcion: new FormControl(null, [ Validators.required ]),
      usuario: new FormControl(null, [ Validators.required, Validators.minLength(12)] ),
      numtrabajador: new FormControl(null, Validators.required)
    })

  }

  get f(): any { return this.frm.controls; }

  onSubmit(): void{
    this.submitted = true;
    
    console.log(this.frm);

    alert('submit');
  }

}
