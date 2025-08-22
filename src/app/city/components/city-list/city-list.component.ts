import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {City} from '../../../core/graphql/models';

@Component({
  selector: 'app-city-list.component',
  imports: [],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss'
})
export class CityListComponent implements OnInit {
  private route = inject(ActivatedRoute)

  cities: City[] = this.route.snapshot.data['cities'];

  ngOnInit() {
    console.log(this.cities);
  }
}
