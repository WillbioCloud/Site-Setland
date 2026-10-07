export function cpfDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 11);
}
export function formatCPF(value: string) {
  return cpfDigits(value)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
export function isValidCPF(value: string) {
  const digits = cpfDigits(value);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  for (let length = 9; length <= 10; length++) {
    const sum = [...digits.slice(0, length)].reduce(
      (total, digit, index) => total + Number(digit) * (length + 1 - index),
      0,
    );
    const check = (sum * 10) % 11;
    if (Number(digits[length]) !== (check === 10 ? 0 : check)) return false;
  }
  return true;
}
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');
}
