import { test, expect } from '@playwright/test';
import { cpfDigits, formatCPF, formatPhone, isValidCPF } from '../data/checkout';
import {
  calculateTicketTotal,
  formatCurrency,
  localDateISO,
  TICKET_PRICES,
  validVisitDate,
} from '../data/visit';

test('Brazilian input masks and CPF checks reject incomplete or repeated digits', () => {
  expect(cpfDigits('123.456.789-09')).toBe('12345678909');
  expect(formatCPF('12345678909')).toBe('123.456.789-09');
  expect(isValidCPF('123.456.789-09')).toBe(true);
  expect(isValidCPF('111.111.111-11')).toBe(false);
  expect(isValidCPF('123')).toBe(false);
  expect(isValidCPF('12345678900')).toBe(false);
  expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
  expect(formatPhone('1134567890')).toBe('(11) 3456-7890');
});

test('visit date validation checks dates rather than comparing arbitrary strings', () => {
  const next = new Date();
  next.setDate(next.getDate() + 10);
  while (next.getDay() === 1) next.setDate(next.getDate() + 1);
  expect(validVisitDate(localDateISO(next))).toBe(true);
  const monday = new Date(next);
  while (monday.getDay() !== 1) monday.setDate(monday.getDate() + 1);
  expect(validVisitDate(localDateISO(monday))).toBe(false);
  expect(validVisitDate('2020-01-01')).toBe(false);
  expect(validVisitDate('not-a-date')).toBe(false);
  expect(validVisitDate('2099-02-31')).toBe(false);
});

test('original ticket prices and Brazilian currency formatting are preserved', () => {
  expect(TICKET_PRICES).toEqual({ adult: 89.9, child: 44.9, senior: 44.9 });
  expect(calculateTicketTotal({ adult: 2, child: 1, senior: 0 })).toBe(224.7);
  expect(calculateTicketTotal({ adult: 20, child: 20, senior: 20 })).toBe(3594);
  expect(formatCurrency(89.9).replace(/\s/g, ' ')).toBe('R$ 89,90');
});
