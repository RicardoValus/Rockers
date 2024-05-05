import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { first, from, map, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  barbersPath: string = 'barbers'

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  addBarber(name: string, image: any) {
    const file = image.item(0)
    const uploadTask = this.uploadMedia(image, 'barberImages', file.name)
    uploadTask?.then(async snapshot => {
      const imageURL = await snapshot.ref.getDownloadURL()
      return this.firestore.collection('barbers').add({ barberName: name, barberImage: imageURL })
    })
  }
  getBarbers() {
    return this.firestore.collection('barbers').snapshotChanges();
  }

  removeBarber(barberID: string) {
    return this.firestore.collection(this.barbersPath).doc(barberID).delete();
  }

  uploadMedia(image: any, PATH: string, fileName: any) {
    const file = image.item(0);
    const path = `${PATH}/${fileName}`;
    let task = this.storage.upload(path, file);
    return task;
  }

  addDate(date: string): Promise<void> {
    return this.firestore
      .collection('dates', (ref) => ref.where('date', '==', date))
      .get()
      .pipe(
        first(),
        mergeMap((snapshot) => {
          if (snapshot.empty) {
            return from(this.firestore.collection('dates').add({ date }));
          } else {
            throw new Error('essa data já existe');
          }
        })
      )
      .toPromise()
      .then(() => {
        return;
      });
  }

  getDates() {
    return this.firestore.collection('dates').snapshotChanges();
  }

  removeDate(dateId: string) {
    return this.firestore.collection('dates').doc(dateId).delete();
  }

}