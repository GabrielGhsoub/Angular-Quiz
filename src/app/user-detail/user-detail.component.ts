import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface UserDetail {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: UserDetail | null = null; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // Check if we have the user details in the session storage
      const cachedData = sessionStorage.getItem(`userDetails-${userId}`);
      if (cachedData) {
        console.log('Using cached data for user ID:', userId);
        this.user = JSON.parse(cachedData);
        return;
      }

      this.http.get<{ data: UserDetail }>(`https://reqres.in/api/users/${userId}`).subscribe({
        next: (response) => {
          console.log('Fetched data for user ID:', userId);
          this.user = response.data;
          sessionStorage.setItem(`userDetails-${userId}`, JSON.stringify(this.user));
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['']); 
  }
}
