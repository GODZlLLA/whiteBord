import { fabric } from 'fabric';

declare module 'fabric' {
  interface Canvas {
    historyUndo: string[];
    historyRedo: string[];
    extraProps: string[];
    historyNextState: string;
    historyProcessing: boolean;
    _historyInit(): void;
    _historyDispose(): void;
    _historyNext(): string;
    _historyEvents(): Record<string, (e: fabric.IEvent) => void>;
    _historySaveAction(): void;
    undo(callback?: () => void): void;
    redo(callback?: () => void): void;
    _loadHistory(history: string, event: string, callback?: () => void): void;
    clearHistory(): void;
  }
}