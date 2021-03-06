import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  day$: Observable<any> = this.db.doc<any>('coreData/day').valueChanges();

  constructor(private db: AngularFirestore) {}

  changeDayNumber(today: number): Promise<void> {
    return this.db.doc('coreData/day').update({
      dayNumber: today,
    });
  }
}
