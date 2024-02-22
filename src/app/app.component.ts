import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router'
import { NgbCarouselModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, Subject, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbCarouselModule, NgbCollapseModule, DragScrollComponent, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('scaleUpOnView', [
      state('inView', style({
        opacity: 1,
        transform: 'scale(2)'
      })),
      transition('* => inView', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.5s ease-out')
      ]),
    ]),
  ]
})
export class AppComponent {
  @ViewChild('nav')
  dragScrollContainer!: ElementRef;
  @ViewChild('thankYouNote', { static: false })
  thankYouNoteRef!: ElementRef;
  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;

  users: User[] = [];
  allUsers: User[] = [];
  searchTerms = new Subject<string>();
  currentPage = 1;
  total_pages = 1;
  pageSize = 6; // Adjust as necessary
  public thankYouNoteInView: boolean = false;
  public isCollapsed = false;
  isNavCollapse = false;
  showMainContent: boolean = true;

  constructor(private router: Router, private http: HttpClient, private renderer: Renderer2, private scroll: ViewportScroller,private activatedRoute: ActivatedRoute) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMainContent = !activatedRoute.firstChild?.snapshot.url.some(segment => segment.path === 'users');
      }
    });
  }

  ngOnInit() {
    this.fetchAllUsers();
    this.setupSearch();
  }

  fetchAllUsers() {
    this.http.get<ApiResponse>(`https://reqres.in/api/users?page=1`).subscribe({
      next: (response) => {
        this.total_pages = response.total_pages;
        const requests = [];
        for (let page = 1; page <= this.total_pages; page++) {
          requests.push(this.http.get<ApiResponse>(`https://reqres.in/api/users?page=${page}`));
        }

        forkJoin(requests).subscribe({
          next: (results) => {
            this.allUsers = results.flatMap(res => res.data);
            this.paginateUsers(this.currentPage);
          },
          error: (error) => console.error(error),
        });
      },
      error: (error) => console.error(error),
    });
  }

  paginateUsers(page: number) {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.users = this.allUsers.slice(startIndex, endIndex);
    this.currentPage = page;
  }

  setupSearch() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term) {
        const filtered = this.allUsers.filter(user =>
          user.first_name.toLowerCase().includes(term.toLowerCase()) ||
          user.last_name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase())
        );
        this.users = filtered.slice(0, this.pageSize);
        this.total_pages = Math.ceil(filtered.length / this.pageSize); 
        this.currentPage = 1;
      } else {
        this.paginateUsers(1); 
      }
    });
  }


  search(term: string): void {
    this.searchTerms.next(term);
  }


  @HostListener('window:scroll', []) onScroll() {
    if (this.scroll.getScrollPosition()[1] > 70) {
      this.isNavCollapse = true;
    } else {
      this.isNavCollapse = false;
    }

    const thankYouNotePosition = this.thankYouNoteRef.nativeElement.offsetTop;
    const pageOffset = window.pageYOffset + window.innerHeight;
    if (thankYouNotePosition < pageOffset) {
      if (!this.thankYouNoteInView) {
        this.thankYouNoteInView = true;
      }
    } else {
      this.thankYouNoteInView = false;
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



  toggleSearch() {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed) {
      setTimeout(() => this.searchInput.nativeElement.focus(), 0);
    }
  }

  navigateToUserDetail(userId: number) {
    console.log('Navigating to user detail for user ID:', userId);

    this.router.navigate(['/users', userId]).then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }

}




