import { generateRegNumber, parseRegNumber, isValidRegNumber } from '../../src/utils/registration-id';

describe('registration-id', () => {
  describe('generateRegNumber', () => {
    it('should generate CX4-0001 for sequence 1', () => {
      expect(generateRegNumber(1)).toBe('CX4-0001');
    });

    it('should generate CX4-0042 for sequence 42', () => {
      expect(generateRegNumber(42)).toBe('CX4-0042');
    });

    it('should generate CX4-9999 for sequence 9999', () => {
      expect(generateRegNumber(9999)).toBe('CX4-9999');
    });

    it('should pad numbers with leading zeros', () => {
      expect(generateRegNumber(5)).toBe('CX4-0005');
      expect(generateRegNumber(55)).toBe('CX4-0055');
      expect(generateRegNumber(555)).toBe('CX4-0555');
    });

    it('should throw for sequence < 1', () => {
      expect(() => generateRegNumber(0)).toThrow('Sequence number must be between 1 and 9999');
    });

    it('should throw for sequence > 9999', () => {
      expect(() => generateRegNumber(10000)).toThrow('Sequence number must be between 1 and 9999');
    });
  });

  describe('parseRegNumber', () => {
    it('should parse a valid reg number', () => {
      expect(parseRegNumber('CX4-0001')).toEqual({ prefix: 'CX4', sequence: 1 });
    });

    it('should parse CX4-0042', () => {
      expect(parseRegNumber('CX4-0042')).toEqual({ prefix: 'CX4', sequence: 42 });
    });

    it('should return null for invalid format', () => {
      expect(parseRegNumber('invalid')).toBeNull();
      expect(parseRegNumber('CX4-')).toBeNull();
      expect(parseRegNumber('CX4-00001')).toBeNull();
      expect(parseRegNumber('')).toBeNull();
    });
  });

  describe('isValidRegNumber', () => {
    it('should return true for valid reg numbers', () => {
      expect(isValidRegNumber('CX4-0001')).toBe(true);
      expect(isValidRegNumber('CX4-9999')).toBe(true);
    });

    it('should return false for invalid reg numbers', () => {
      expect(isValidRegNumber('invalid')).toBe(false);
      expect(isValidRegNumber('CX-0001')).toBe(false);
      expect(isValidRegNumber('CX4-00001')).toBe(false);
    });
  });
});
