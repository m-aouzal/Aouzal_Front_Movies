import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HashService {
  hashCode(input: string): number {
    let hash = 0;
    if (input.length === 0) {
      return hash;
    }
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}
