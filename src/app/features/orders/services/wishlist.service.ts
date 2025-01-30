
// wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  wishlistItems$ = this.wishlistItems.asObservable();

  addToWishlist(item: WishlistItem) {
    const currentItems = this.wishlistItems.getValue();
    if (!currentItems.find(i => i.id === item.id)) {
      this.wishlistItems.next([...currentItems, item]);
    }
  }

  removeFromWishlist(itemId: string) {
    const currentItems = this.wishlistItems.getValue();
    this.wishlistItems.next(currentItems.filter(item => item.id !== itemId));
  }

  clearWishlist() {
    this.wishlistItems.next([]);
  }
}
