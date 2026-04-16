import { Directive, ElementRef, OnInit, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appCopCurrencyInput]',
  host: {
    '(focus)': 'onFocusOrClick()',
    '(click)': 'onFocusOrClick()',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()'
  }
})
export class CopCurrencyInputDirective implements OnInit {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  private shouldClearOnInteraction = true;

  ngOnInit(): void {
    const valorInicial = this.toPositiveNumber(this.ngControl?.value ?? this.input.value);
    if (valorInicial === 0) {
      this.render('');
      return;
    }

    this.render(this.formatThousands(valorInicial.toString()));
  }

  onFocusOrClick(): void {
    if (!this.shouldClearOnInteraction) {
      return;
    }

    this.shouldClearOnInteraction = false;
    this.updateControl(0);
    this.render('');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const digitsOnly = target.value.replace(/\D/g, '');

    if (!digitsOnly) {
      this.updateControl(0);
      this.render('');
      return;
    }

    const normalized = digitsOnly.replace(/^0+/, '') || '0';
    const numericValue = this.toPositiveNumber(normalized);

    this.updateControl(numericValue);
    this.render(this.formatThousands(normalized));
  }

  onBlur(): void {
    this.shouldClearOnInteraction = true;

    if (!this.input.value.trim()) {
      this.updateControl(0);
    }
  }

  private get input(): HTMLInputElement {
    return this.elementRef.nativeElement;
  }

  private updateControl(value: number): void {
    const control = this.ngControl?.control;
    if (!control || control.value === value) {
      return;
    }

    control.setValue(value, { emitEvent: false });
  }

  private render(value: string): void {
    if (this.input.value !== value) {
      this.input.value = value;
    }
  }

  private formatThousands(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private toPositiveNumber(value: unknown): number {
    const asNumber = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      return 0;
    }

    return Math.floor(asNumber);
  }
}
