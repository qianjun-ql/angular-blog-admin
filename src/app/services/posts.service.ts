import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
    ) { }

  uploadImage(selectedImage: any, postData: any, formStatus: any, id: any) {
    const filePath = `postIMG/${Date.now()}`;
    
    this.storage.upload(filePath, selectedImage).then(() => {
      this.storage.ref(filePath).getDownloadURL().subscribe(url => {
        postData.postImgPath = url;

        if (formStatus == 'Edit') {
          this.updateSinglePostData(id, postData);
        } else {
          this.saveData(postData);
        }

      })
    })
  }

  saveData(postData: any) {
    this.afs.collection('posts').add(postData).then(docRef => {
      this.toastr.success('Data uploaded successfully');
      this.router.navigate(['/posts']);
    })
  }

  loadPostData() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      })
    }
    ))
  }

  loadSinglePostData(id: any) {
    return this.afs.doc(`posts/${id}`).valueChanges();
  }

  updateSinglePostData(id: any, postData: any) {
    this.afs.doc(`posts/${id}`).update(postData).then(() => {
      this.toastr.success("Data updated successfully");
      this.router.navigate(['/posts']);
    })
  }

  deleteImage(postImgPath: any, id: any) {
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.deleteSinglePostData(id);
    })
  }

  deleteSinglePostData(id: any) {
    this.afs.doc(`posts/${id}`).delete().then(() => {
      this.toastr.warning('Delete data successfully');
    })
  }

  markFeatured(id: any, featuredPost: any) {
    this.afs.doc(`posts/${id}`).update(featuredPost).then(() => {
      this.toastr.info('Featured status updated successfully');
    })
  }

}