import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalCommandsService } from '../services/terminal-commands';

interface HistoryItem {
  command: string;
  output: string;
  timestamp: Date;
}

@Component({
  selector: 'app-terminal',
  imports: [CommonModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css',
})
export class TerminalComponent implements OnInit, AfterViewInit {
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;
  @ViewChild('terminalHistory') terminalHistory!: ElementRef<HTMLDivElement>;

  history: string[] = [];
  historyIndex = -1;
  terminalOutput: HistoryItem[] = [];

  constructor(private commandService: TerminalCommandsService) {}

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    // Focus the input field
    this.terminalInput.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent) {
    switch(event.key) {
      case 'Enter':
        event.preventDefault();
        this.executeCommand();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateHistory('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateHistory('down');
        break;
      case 'Tab':
        event.preventDefault();
        this.handleTabCompletion();
        break;
    }
  }

  executeCommand() {
    const input = this.terminalInput.nativeElement.value.trim();
    if (!input) return;

    // Add to history
    this.history.push(input);
    this.historyIndex = this.history.length;

    let output = '';

    // Handle built-in commands
    if (input.toLowerCase() === 'clear') {
      this.terminalOutput = [];
      this.terminalInput.nativeElement.value = '';
      return;
    } else if (input.toLowerCase() === 'sudo') {
      output = `<div class="text-error">Nice try! This is a frontend terminal 😉</div>`;
    } else if (input.toLowerCase() === 'exit') {
      output = `<div class="text-error">Cannot exit browser terminal. Try closing the tab instead!</div>`;
    } else {
      // Try to execute command via service
      const result = this.commandService.executeCommand(input);
      if (result !== null) {
        output = result;
      } else {
        output = `<div class="text-error">Command '${input}' not found.</div><div class="text-muted">Type 'help' for available commands.</div>`;
      }
    }

    // Add to terminal output
    this.terminalOutput.push({
      command: input,
      output: output,
      timestamp: new Date()
    });

    // Clear input
    this.terminalInput.nativeElement.value = '';
    
    // Scroll to bottom
    setTimeout(() => this.scrollToBottom(), 0);
  }

  navigateHistory(direction: 'up' | 'down') {
    if (this.history.length === 0) return;

    if (direction === 'up') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.terminalInput.nativeElement.value = this.history[this.historyIndex];
      }
    } else if (direction === 'down') {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.terminalInput.nativeElement.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.terminalInput.nativeElement.value = '';
      }
    }
  }

  handleTabCompletion() {
    const input = this.terminalInput.nativeElement.value;
    const availableCommands = [...this.commandService.getCommandNames(), 'clear', 'sudo', 'exit'];
    
    const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
    
    if (matches.length === 1) {
      this.terminalInput.nativeElement.value = matches[0];
    } else if (matches.length > 1) {
      // Show available matches
      this.terminalOutput.push({
        command: input,
        output: `<div class="text-muted">Available: ${matches.join(', ')}</div>`,
        timestamp: new Date()
      });
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  scrollToBottom() {
    const historyElement = this.terminalHistory.nativeElement;
    historyElement.scrollTop = historyElement.scrollHeight;
  }
}
