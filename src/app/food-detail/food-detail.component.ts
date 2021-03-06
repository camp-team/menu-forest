import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FoodService } from '../services/food.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';
import { Food } from '@interfaces/food';
import { LoadingService } from '../services/loading.service';
import { RakutenRecipeApiService } from '../services/rakuten-recipe-api.service';
import { TitleService } from '../services/title.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss'],
})
export class FoodDetailComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  food$: Observable<Food>;
  recipes: any[];
  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private loadingService: LoadingService,
    private rakutenRecipeApiService: RakutenRecipeApiService,
    private titleService: TitleService,
    private location: Location
  ) {
    this.loadingService.toggleLoading(true);
  }

  ngOnInit(): void {
    this.getFood();
    this.getCategoryRanking();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getFood(): void {
    this.food$ = this.route.paramMap.pipe(
      take(1),
      switchMap((prams: ParamMap) => {
        const id = prams.get('detail');
        return this.foodService.getFoodById(id);
      }),
      tap((food: Food) => {
        this.titleService.setTitle(`${food.name}のレシピ`);
      })
    );
  }

  private getCategoryRanking(): void {
    this.subscription = this.food$.subscribe((food: Food) => {
      this.rakutenRecipeApiService
        .getCategoryRanking(food.categoryId)
        .then((data: any) => {
          this.recipes = data.result;
          this.loadingService.toggleLoading(false);
          this.isLoading = true;
        });
    });
  }

  backToBeforePage(): void {
    this.location.back();
  }
}
