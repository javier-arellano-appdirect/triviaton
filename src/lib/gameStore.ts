import { SerializedGameState } from '@/types/game';

class GameStore {
  private state: SerializedGameState | null = null;
  private subscribers: Set<(state: SerializedGameState) => void> = new Set();

  getState(): SerializedGameState | null {
    return this.state;
  }

  setState(newState: SerializedGameState): void {
    this.state = newState;
    this.broadcast();
  }

  subscribe(callback: (state: SerializedGameState) => void): () => void {
    this.subscribers.add(callback);
    
    // Send current state immediately if available
    if (this.state) {
      callback(this.state);
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private broadcast(): void {
    if (!this.state) return;
    
    this.subscribers.forEach((callback) => {
      try {
        callback(this.state!);
      } catch (error) {
        console.error('Error broadcasting to subscriber:', error);
      }
    });
  }
}

// Use globalThis to ensure a true singleton across Next.js hot module reloads
const globalForGameStore = globalThis as unknown as { __gameStore: GameStore };

if (!globalForGameStore.__gameStore) {
  globalForGameStore.__gameStore = new GameStore();
}

export const gameStore = globalForGameStore.__gameStore;
