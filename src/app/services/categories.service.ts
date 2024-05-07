import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore, private toastr: ToastrService) { }

  saveCatData(data: any) {
    this.afs.collection('categories').add(data).then(docRef => {
      this.toastr.success('Category added successfully');
    })
    .catch(err => { console.log(err) });
  }

  loadCatData() {
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      })
    }
    ))
  }

  updateCatData(id: any, EditData: any) {
    this.afs.doc(`categories/${id}`).update(EditData).then(docRef => {
      this.toastr.success('Category updated successfully');
    })
  }

  deleteCatData(id: any) {
    this.afs.doc(`categories/${id}`).delete().then(docRef => {
      this.toastr.success('Category deleted successfully');
    })
  }

}
