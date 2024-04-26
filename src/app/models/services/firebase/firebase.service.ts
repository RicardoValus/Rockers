import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  addBarber(name: string, avatarUrl: string) {
    const barberId = this.firestore.createId();
    const barberData = { barberName: name, barberAvatar: avatarUrl };

    return this.firestore.collection('barbers').doc(barberId).set(barberData)
      .then(() => {
        return barberId;
      })
      .catch(error => {
        throw error;
      });
  }


  getBarbers() {
    return this.firestore.collection('barbers').valueChanges();
  }

  removeBarber(barberId: string) {
    return this.firestore.collection('barbers').doc(barberId).delete();
  }

}
