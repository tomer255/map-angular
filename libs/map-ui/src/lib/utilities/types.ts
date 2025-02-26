import { InputSignal, SimpleChange } from '@angular/core';

export type SimpleChangeTyped<T> = Omit<
  SimpleChange,
  'previousValue' | 'currentValue'
> & {
  previousValue: T;
  currentValue: T;
};

export type SimpleChangesTyped<T> = {
  [K in keyof T]: T[K] extends InputSignal<infer U>
    ? SimpleChangeTyped<U>
    : never;
};
