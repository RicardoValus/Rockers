import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { async, first, from, map, mergeMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface Appointment {
  services: { name: string, uid: string }[];
  barber: any;
  date: string;
  time: string;
  userId: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  barbersPath: string = 'barbers'
  userId = this.authService.getLoggedUserThroughLocalStorage().uid


  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService
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

  addTime(times: string[]) {
    const promises = times.map(time => {
      const id = this.firestore.createId();
      return this.firestore.collection('times').doc(id).set({ time });
    });
    return Promise.all(promises);
  }

  getTimes() {
    return this.firestore.collection('times').snapshotChanges();
  }

  removeTime(timeId: string) {
    return this.firestore.collection('times').doc(timeId).delete();
  }

  addAppointment(appointment: Appointment) {
    return this.firestore.collection('appointments').doc().set(appointment);
  }

  getUserAppointments() {
    return this.firestore.collection('appointments', ref => ref.where('userId', '==', this.userId)).snapshotChanges();
  }


  removeAppointment(appointmentId: string) {
    return this.firestore.collection('appointments').doc(appointmentId).delete();
  }

  getAllAppointments() {
    return this.firestore.collection('appointments').snapshotChanges()
  }

  getUsers() {
    return this.firestore.collection('users', ref => ref.where('uid', '==', this.userId)).snapshotChanges();
  }

  async getImageDownloadURL(image: any, path: string, id: string) {
    var imageURL: string = ''
    const uploadTask = this.uploadImage(image, path, id)
    await uploadTask?.then(async snapshot => {
      imageURL = await snapshot.ref.getDownloadURL()
    })
    return imageURL
  }

  uploadImage(image: any, PATH: string, fileName: any) {
    const file = image.item(0)
    const path = `${PATH}/${fileName}`
    let task = this.storage.upload(path, file)
    return task
  }

  checkForDuplicateAppointment(appointment: Appointment): Promise<boolean> {
    return this.firestore.collection('appointments').ref.where('barber.id', '==', appointment.barber.id)
      .where('date', '==', appointment.date)
      .where('time', '==', appointment.time)
      .get()
      .then(snapshot => {
        return snapshot.size > 0;
      });
  }
}
