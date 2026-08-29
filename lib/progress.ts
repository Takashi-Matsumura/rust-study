import { useSyncExternalStore } from "react";

export interface ProgressSnapshot {
  completedLessonIds: string[];
  updatedAt: string;
}

const STORAGE_KEY = "rust-study:progress:v1";

// useSyncExternalStoreのgetServerSnapshotは、hydration中も同じ参照を
// 返し続ける必要がある。モジュールレベルの定数として固定しておく。
const EMPTY_SNAPSHOT: ProgressSnapshot = Object.freeze({
  completedLessonIds: [],
  updatedAt: "",
});

type Listener = () => void;

/**
 * 進捗をlocalStorageに保存するストア。DBに差し替える場合はこのクラスの
 * 実装だけを差し替えればよい(呼び出し側のインターフェースは変えない)。
 */
class ProgressStore {
  private snapshot: ProgressSnapshot = EMPTY_SNAPSHOT;
  private listeners = new Set<Listener>();
  private hydrated = false;

  private hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.snapshot = JSON.parse(raw) as ProgressSnapshot;
      }
    } catch {
      // 壊れたデータやアクセス不可(プライベートモード等)は空のまま無視する
    }
  }

  getSnapshot = (): ProgressSnapshot => {
    this.hydrate();
    return this.snapshot;
  };

  // SSR/初回hydration時は常に空の進捗を返し、mismatchを避ける
  getServerSnapshot = (): ProgressSnapshot => EMPTY_SNAPSHOT;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private commit(next: ProgressSnapshot) {
    this.snapshot = next;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // 書き込み失敗(容量超過・プライベートモード等)は無視する
    }
    this.listeners.forEach((listener) => listener());
  }

  markCompleted(lessonId: string): void {
    this.hydrate();
    if (this.snapshot.completedLessonIds.includes(lessonId)) return;
    this.commit({
      completedLessonIds: [...this.snapshot.completedLessonIds, lessonId],
      updatedAt: new Date().toISOString(),
    });
  }
}

export const progressStore = new ProgressStore();

export function useProgress(): ProgressSnapshot {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  );
}
