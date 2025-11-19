import { 
  Component, 
  ElementRef, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  AfterViewInit, 
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalCommandsService } from '../../services/terminal-commands';

interface TerminalHistoryItem {
  readonly command: string;
  readonly output: string;
  readonly timestamp: Date;
}

type HistoryDirection = 'up' | 'down';
type KeyboardAction = 'enter' | 'arrowUp' | 'arrowDown' | 'tab';

@Component({
  selector: 'app-terminal',
  imports: [CommonModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css',
})
export class TerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminalInput', { static: true }) 
  private readonly terminalInput!: ElementRef<HTMLInputElement>;
  
  @ViewChild('terminalContent', { static: true }) 
  private readonly terminalContent!: ElementRef<HTMLDivElement>;

  // Public properties for template
  readonly terminalOutput: TerminalHistoryItem[] = [];
  
  // Private state management
  private readonly commandHistory: string[] = [];
  private historyIndex = -1;
  
  // Dependency injection
  private readonly commandService = inject(TerminalCommandsService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Built-in commands configuration
  private readonly builtInCommands = new Map<string, () => string>([
    ['clear', () => this.handleClearCommand()],
    ['sudo', () => '<div class="text-error">Nice try! This is a frontend terminal 😉</div>'],
    ['exit', () => '<div class="text-error">Cannot exit browser terminal. Try closing the tab instead!</div>']
  ]);

  ngOnInit(): void {
    this.initializeTerminal();
  }

  ngAfterViewInit(): void {
    this.setupTerminalInput();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Public methods for template
  onKeyDown(event: KeyboardEvent): void {
    const action = this.mapKeyToAction(event.key);
    if (!action) return;

    event.preventDefault();
    this.handleKeyboardAction(action);
  }

  // Private initialization methods
  private initializeTerminal(): void {
    // Initialize terminal state if needed
  }

  private setupTerminalInput(): void {
    this.focusInput();
  }

  private cleanup(): void {
    // Cleanup resources if needed
  }

  private focusInput(): void {
    this.terminalInput.nativeElement.focus();
  }

  // Keyboard handling
  private mapKeyToAction(key: string): KeyboardAction | null {
    const keyMap: Record<string, KeyboardAction> = {
      'Enter': 'enter',
      'ArrowUp': 'arrowUp',
      'ArrowDown': 'arrowDown',
      'Tab': 'tab'
    };
    return keyMap[key] || null;
  }

  private handleKeyboardAction(action: KeyboardAction): void {
    const actionHandlers: Record<KeyboardAction, () => void> = {
      enter: () => this.executeCommand(),
      arrowUp: () => this.navigateHistory('up'),
      arrowDown: () => this.navigateHistory('down'),
      tab: () => this.handleTabCompletion()
    };
    
    actionHandlers[action]();
  }

  // Command execution
  private executeCommand(): void {
    const input = this.getCurrentInput();
    if (!input) return;

    this.addToHistory(input);
    const output = this.processCommand(input);
    
    if (input.toLowerCase() !== 'clear') {
      this.addToOutput(input, output);
    }
    
    this.clearInput();
    this.autoScrollToBottom();
  }

  private getCurrentInput(): string {
    return this.terminalInput.nativeElement.value.trim();
  }

  private addToHistory(command: string): void {
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;
  }

  private processCommand(input: string): string {
    const [command, ...args] = input.trim().split(/\s+/);
    const cmd = command.toLowerCase();
    
    // Check built-in commands first
    const builtInHandler = this.builtInCommands.get(cmd);
    if (builtInHandler) {
      return builtInHandler();
    }

    // Handle cd command specially
    if (cmd === 'cd') {
      const destination = args[0] || '~';
      return this.commandService.handleCdCommand(destination);
    }

    // Try external command service
    const result = this.commandService.executeCommand(cmd);
    return result ?? this.getCommandNotFoundMessage(command);
  }

  private handleClearCommand(): string {
    this.clearTerminalOutput();
    return '';
  }

  private clearTerminalOutput(): void {
    (this.terminalOutput as TerminalHistoryItem[]).length = 0;
  }

  private getCommandNotFoundMessage(command: string): string {
    return `<div class="text-error">Command '${command}' not found.</div><div class="text-muted">Type 'help' for available commands.</div>`;
  }

  private addToOutput(command: string, output: string): void {
    const newItem: TerminalHistoryItem = {
      command,
      output,
      timestamp: new Date()
    };
    
    (this.terminalOutput as TerminalHistoryItem[]).push(newItem);
  }

  private clearInput(): void {
    this.terminalInput.nativeElement.value = '';
  }

  private autoScrollToBottom(): void {
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    // Find the parent terminal container and scroll it
    const terminalContainer = document.querySelector('.terminal');
    if (terminalContainer) {
      terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
  }

  // History navigation
  private navigateHistory(direction: HistoryDirection): void {
    if (this.commandHistory.length === 0) return;

    const newIndex = this.calculateNewHistoryIndex(direction);
    this.historyIndex = newIndex;
    this.setInputFromHistory();
  }

  private calculateNewHistoryIndex(direction: HistoryDirection): number {
    if (direction === 'up') {
      return Math.max(0, this.historyIndex - 1);
    } else {
      return Math.min(this.commandHistory.length, this.historyIndex + 1);
    }
  }

  private setInputFromHistory(): void {
    const command = this.historyIndex < this.commandHistory.length 
      ? this.commandHistory[this.historyIndex] 
      : '';
    this.terminalInput.nativeElement.value = command;
  }

  // Tab completion
  private handleTabCompletion(): void {
    const input = this.getCurrentInput();
    const suggestions = this.getCommandSuggestions(input);
    
    if (suggestions.length === 1) {
      this.completeCommand(suggestions[0]);
    } else if (suggestions.length > 1) {
      this.showSuggestions(input, suggestions);
    }
  }

  private getCommandSuggestions(input: string): string[] {
    const allCommands = [
      ...this.commandService.getCommandNames(),
      ...Array.from(this.builtInCommands.keys())
    ];
    
    return allCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );
  }

  private completeCommand(command: string): void {
    this.terminalInput.nativeElement.value = command;
  }

  private showSuggestions(input: string, suggestions: string[]): void {
    const output = `<div class="text-muted">Available: ${suggestions.join(', ')}</div>`;
    this.addToOutput(input, output);
    this.autoScrollToBottom();
  }
}