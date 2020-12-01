import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { FormControl } from '@angular/forms';
import { SearchIndex } from 'algoliasearch/lite';
import { startWith } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  private index: SearchIndex = this.searchService.index.foods;
  private searchOptionsSubscription: Subscription;
  private searchResultsSubscription: Subscription;

  searchControl = new FormControl('');
  searchOptions: any[];
  searchResults: any[];

  constructor(
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {
    this.titleService.setTitle('検索');
  }

  ngOnInit(): void {
    this.setSearchOptions();
    this.setSearchResults();
  }

  ngOnDestroy(): void {
    this.searchOptionsSubscription.unsubscribe();
    this.searchResultsSubscription.unsubscribe();
  }

  private setSearchOptions(): void {
    this.searchOptionsSubscription = this.searchControl.valueChanges
      .pipe(startWith(''))
      .subscribe((value) => {
        this.index
          .search(value)
          .then((result) => (this.searchOptions = result.hits));
      });
  }

  private getRandomRotateId(): string {
    const rotateTypeIds: string[] = ['a', 'b', 'c', 'd', 'e'];
    const randomNumber: number = Math.floor(
      Math.random() * rotateTypeIds.length
    );
    return rotateTypeIds[randomNumber];
  }

  private setSearchResults(): void {
    this.searchResultsSubscription = this.route.queryParamMap.subscribe(
      (param: ParamMap) => {
        const query = param.get('query');
        this.index.search(query).then((result) => {
          result.hits.map((food: any) => {
            const rotateTypeId: string = this.getRandomRotateId();
            food.rotateTypeId = rotateTypeId;
          });
          this.searchResults = result.hits;
        });
      }
    );
  }

  displayFn(food): string {
    return food && food.name ? food.name : '';
  }

  routeSearch(searchQuery): void {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        query: searchQuery || null,
      },
    });
  }

  navigateByFoodId(foodId: string): void {
    this.router.navigateByUrl(`/food-list/${foodId}`);
  }

  setSearchQuery(value): void {
    this.searchControl.setValue(value, {
      emitEvent: false,
    });
  }
}
