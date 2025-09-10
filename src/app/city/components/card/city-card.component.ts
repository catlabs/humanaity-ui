import {Component, input, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {City} from '../../../core/graphql/models';

@Component({
  selector: 'app-city-card',
  imports: [
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss'
})
export class CityCardComponent implements OnInit {
  city = input.required<City>();

  ngOnInit() {

  }

  
}
