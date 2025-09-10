import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {City} from '../../../core/graphql/models';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {CityCardComponent} from '../../components/card/city-card.component';

@Component({
  imports: [CommonModule, MatButtonModule, MatCardModule, CityCardComponent],
  templateUrl: './city-list.page.html',
  styleUrl: './city-list.page.scss'
})
export class CityListPage implements OnInit {
  private route = inject(ActivatedRoute)

  cities: City[] = this.route.snapshot.data['cities'];

  ngOnInit() {
    //console.log(this.cities);
  }
}
