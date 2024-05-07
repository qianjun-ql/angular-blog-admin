import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit{

  categoryArray: any[] = [];
  formCategory: any;
  formStatus: string = 'Add';
  categoryId: any;

  constructor(private categoryService: CategoriesService) { }

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.categoryService.loadCatData().subscribe(val => {
        this.categoryArray = val;
      })
      
    }

    onSubmit(formData: any) {
      let categoryData: Category = {
        category: formData.value.category
      }

      if (this.formStatus == 'Add') {
        this.categoryService.saveCatData(categoryData);
      } else if (this.formStatus == 'Edit') {
        this.categoryService.updateCatData(this.categoryId, categoryData);
        this.formStatus = 'Add';
      }
      formData.reset();
    }

    onEdit(category: any, id: string) {
      this.formCategory = category;
      this.formStatus = 'Edit';
      this.categoryId = id;
    }

    onDelete(id: string) {
      this.categoryService.deleteCatData(id);
    }
}
