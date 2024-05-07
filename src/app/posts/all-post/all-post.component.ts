import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit{
  postArray: any[] = [];

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
      this.postService.loadPostData().subscribe(val => {
        this.postArray = val;
      })
  }

  onDeletePostData(postImgPath: any, id: any) {
    this.postService.deleteImage(postImgPath, id);
    }

  onFeatured(id: any, value: any) {
    const featuredPost = {
      isFeatured: value
    }

    this.postService.markFeatured(id, featuredPost);
  }
}
