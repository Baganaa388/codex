const PREFIX = 'CX4';

export function generateRegNumber(sequenceNumber: number): string {
  if (sequenceNumber < 1 || sequenceNumber > 9999) {
    throw new Error('Sequence number must be between 1 and 9999');
  }
  const padded = String(sequenceNumber).padStart(4, '0');
  return `${PREFIX}-${padded}`;
}

export function parseRegNumber(regNumber: string): { prefix: string; sequence: number } | null {
  const match = regNumber.match(/^(CX\d)-(\d{4})$/);
  if (!match) {
    return null;
  }
  return {
    prefix: match[1],
    sequence: parseInt(match[2], 10),
  };
}

export function isValidRegNumber(regNumber: string): boolean {
  return /^CX\d-\d{4}$/.test(regNumber);
}
