import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CityOutput} from '../../../api/model/models';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {CityCardComponent} from '../../components/card/city-card.component';

@Component({
  imports: [CommonModule, CityCardComponent, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './city-list.page.html',
  styleUrl: './city-list.page.scss'
})
export class CityListPage implements OnInit {
  private route = inject(ActivatedRoute)

  cities: CityOutput[] = this.route.snapshot.data['cities'];

  ngOnInit() {
  }
}
