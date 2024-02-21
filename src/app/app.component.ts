import { ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import data from '../assets/data/products.json';
import { RouterOutlet } from '@angular/router'
import { NgbCarouselModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbCarouselModule, NgbCollapseModule, DragScrollComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  productList: Product[] = new Array<Product>();
  jsonData = data as Array<any>;
  direction = "";

  public isCollapsed = false;

  isNavCollapse = false;
  @HostListener('window:scroll', []) onScroll() {
    if (this.scroll.getScrollPosition()[1] > 70) {
      this.isNavCollapse = true;
    } else {
      this.isNavCollapse = false;
    }
  }

  constructor(private scroll: ViewportScroller) { }

  ngOnInit() {
    for (let i = 0; i < 9; i++) {
      let product = new Product(this.jsonData[i]);
      this.productList.push(product);
    }
  }

  scrollToLeft(): void {
    const element = document.getElementById('scroll-1');
    if (element) {
      element.scrollLeft -= 400;
    }
  }

  scrollToRight(): void {
    const element = document.getElementById('scroll-1');
    if (element) {
      element.scrollLeft += 400;
    }
  }
}

class Product {
  title: string;
  type: string;
  description: string;
  price: number;
  rating: number;
  image: string;

  constructor(product: any = {}) {
    this.title = product.title;
    this.type = product.type;
    this.description = product.description;
    this.price = product.price;
    this.rating = product.rating;
    this.image = 'https://alcodesbase.blob.core.windows.net/generic/sections-default-image.png';
  }
}
