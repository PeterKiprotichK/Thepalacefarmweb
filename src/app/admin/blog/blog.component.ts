import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ServicesService } from '../../shared/services/services.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blog = {
    id: '',
    title: '',
    content: '',
    imageUrl: '',
  };

  blogs: any[] = [];
  editing = false;
  showForm = false; // toggle blog form visibility

  constructor(private servicesService: ServicesService, private toast: ToastService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.servicesService.getAllBlogs().subscribe({
      next: (data) => (this.blogs = data),
      error: (err) => {
        console.error('Error loading blogs:', err);
        if (isPlatformBrowser(this.platformId)) {
          try { this.toast.error('Failed to load blogs'); } catch (e) {}
        }
      },
    });
  }

  submitBlog() {
    const { id, ...blogData } = this.blog;

    if (this.editing) {
      this.servicesService.updateBlog(id, blogData).subscribe({
        next: () => {
          if (isPlatformBrowser(this.platformId)) {
            try { this.toast.success('Blog updated successfully!'); } catch (e) {}
          }
          this.resetForm();
          this.loadBlogs();
        },
        error: (err) => {
          console.error('Error updating blog:', err);
          if (isPlatformBrowser(this.platformId)) {
            try { this.toast.error('Error updating blog: ' + (err.error?.message || err.message || 'Unknown error')); } catch (e) {}
          }
        },
      });
    } else {
      this.servicesService.submitBlog(blogData).subscribe({
        next: () => {
          if (isPlatformBrowser(this.platformId)) {
            try { this.toast.success('Blog submitted successfully!'); } catch (e) {}
          }
          this.resetForm();
          this.loadBlogs();
        },
        error: (err) => {
          console.error('Error submitting blog:', err);
          if (isPlatformBrowser(this.platformId)) {
            try { this.toast.error('Error submitting blog: ' + (err.error?.message || err.message || 'Unknown error')); } catch (e) {}
          }
        },
      });
    }
  }

  editBlog(blogItem: any) {
    this.blog = {
      id: blogItem._id || blogItem.id,
      title: blogItem.title,
      content: blogItem.content,
      imageUrl: blogItem.imageUrl || '',
    };
    this.editing = true;
    this.showForm = true; // ensure form visible on edit
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteBlog(blogId: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.servicesService.deleteBlog(blogId).subscribe({
        next: () => {
          if (isPlatformBrowser(this.platformId)) {
            try { this.toast.success('Blog deleted successfully!'); } catch (e) {}
          }
          this.loadBlogs();
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          if (isPlatformBrowser(this.platformId)) {
            try { this.toast.error('Error deleting blog: ' + (err.error?.message || err.message || 'Unknown error')); } catch (e) {}
          }
        },
      });
    }
  }

  private resetForm() {
    this.blog = { id: '', title: '', content: '', imageUrl: '' };
    this.editing = false;
    this.showForm = false; // hide form when reset
  }
}
