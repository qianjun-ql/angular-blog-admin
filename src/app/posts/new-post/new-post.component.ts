import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit{

  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.png';
  selectedImg: any;

  categories: any[] = [];

  postForm!: FormGroup;

  post: any;

  formStatus: string = 'Add New';

  docId: string = '';

  constructor(
    private categoryService: CategoriesService, 
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
    ) {
      this.route.queryParams.subscribe(val => {
        this.docId = val['id'];

        if (this.docId) {
          this.postService.loadSinglePostData(val['id']).subscribe(post => {
            this.post = post;
            this.postForm = this.fb.group({
              title: [this.post.title, [Validators.required, Validators.minLength(10)]],
              permalink: [{ value: this.post.permalink, disabled: true }, Validators.required],
              excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
              category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
              content: [this.post.content, Validators.required],
              postImg: ['', Validators.required],
            });
  
            this.imgSrc = this.post.postImgPath;
            this.formStatus = 'Edit';
          })
        } else {
          this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(10)]],
            permalink: [{ value: '', disabled: true }, Validators.required],
            excerpt: ['', [Validators.required, Validators.minLength(50)]],
            category: ['', Validators.required],
            content: ['', Validators.required],
            postImg: ['', Validators.required],
        })
      }})
    };

  ngOnInit(): void {
      this.categoryService.loadCatData().subscribe(val => {
        this.categories = val;
      })
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChange($event: any)  {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    }

    reader.readAsDataURL($event?.target?.files[0]);
    this.selectedImg = $event.target.files[0];
  }


  onSubmitForm() {
    const splitCat = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      // permalink: this.postForm.value.permalink,
      permalink: this.postForm.value.title.replace(/\s+/g, '-').toLowerCase(),
      category: {
        categoryId: splitCat[0],
        category: splitCat[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    }
    this.postService.uploadImage(this.selectedImg, postData, this.formStatus, this.docId);
      this.postForm.reset();
      this.imgSrc = './assets/placeholder-image.png';
  }

}
