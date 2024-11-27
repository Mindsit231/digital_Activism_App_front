import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  position: string = 'bottom';
  footerTopMinValue: number = 200;

  handleFooterTopMinValue(event: Event, value: number): void {
    console.log('Resize event triggered:', event);
    this.footerTopMinValue = value;
  }
  publicPosts: any[] = [
    {
      id: 1,
      title: 'Save the Forests!',
      body: 'Join us to protect our green cover from deforestation.',
      tags: ['Environment', 'Protest'],
      likesCount: 0,
      sharesCount: 0,
      comments: ['Great initiative!', 'I am  joining!'],
      creationDate: new Date().toLocaleString(),
      image: '',
      isPrivate: false,
    },
  ];
  privatePosts: any[] = [];
  groupMembers: string[] = [];
  isMember: boolean = false;

  detailedPost: any = null;
  newPost: any = { title: '', body: '', tags: '', comments: [], creationDate: '', image: '', isPrivate: false };
  newComment: string = '';

  joinGroup(): void {
    this.isMember = true;
    this.groupMembers.push('You'); // Add user to the group members list
  }

  onPostClick(post: any): void {
    this.detailedPost = post;
  }

  closePostDetail(): void {
    this.detailedPost = null;
  }

  likePost(post: any): void {
    post.likesCount++;
  }

  sharePost(post: any): void {
    post.sharesCount++;
  }

  addComment(post: any): void {
    if (this.newComment.trim()) {
      post.comments.push(this.newComment.trim());
      this.newComment = '';
    }
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPost.image = reader.result as string; // Store Base64 string of the image
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  addNewPost(): void {
    if (this.newPost.title && this.newPost.body) {
      const newPost = {
        ...this.newPost,
        tags: this.newPost.tags.split(',').map((tag: string) => tag.trim()),
        creationDate: new Date().toLocaleString(),
        likesCount: 0,
        sharesCount: 0,
      };
      if (newPost.isPrivate) {
        this.privatePosts.push(newPost);
      } else {
        this.publicPosts.push(newPost);
      }
      this.newPost = { title: '', body: '', tags: '', comments: [], creationDate: '', image: '', isPrivate: false };
    }
  }

  deletePost(post: any): void {
    if (post.isPrivate) {
      this.privatePosts = this.privatePosts.filter((p) => p !== post);
    } else {
      this.publicPosts = this.publicPosts.filter((p) => p !== post);
    }
  }
}
