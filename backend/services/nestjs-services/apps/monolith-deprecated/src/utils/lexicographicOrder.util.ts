/**
 * Lexicographic Order Generator
 * 
 * Generates sortable string keys for maintaining item order in databases.
 * Think of it like library call numbers - you can always insert a new book
 * between any two existing books without renumbering everything.
 * 
 * Example: If you have items at positions "a" and "c", you can insert
 * a new item at "b" without updating the other items.
 * 
 * Used for: drag-and-drop lists, kanban boards, todo lists, etc.
 */

export class LexicographicOrderGenerator {
  private static readonly BASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly MID_CHAR = 'n'; // Middle character for initial positions
  private static readonly MIN_CHAR = 'a';
  private static readonly MAX_CHAR = 'z';

  /**
   * Generates the first position string
   * @returns Initial position (default: "n")
   */
  static generateFirst(): string {
    return this.MID_CHAR;
  }

  /**
   * Generates a position string after the given position
   * @param after - The position to insert after
   * @returns New position string
   */
  static generateAfter(after: string): string {
    // If after ends with 'z', append the mid character
    if (after.endsWith(this.MAX_CHAR)) {
      return after + this.MID_CHAR;
    }

    // Increment the last character
    const prefix = after.slice(0, -1);
    const lastChar = after[after.length - 1];
    const nextChar = this.getNextChar(lastChar);

    return prefix + nextChar;
  }

  /**
   * Generates a position string before the given position
   * @param before - The position to insert before
   * @returns New position string
   */
  static generateBefore(before: string): string {
    // If before ends with 'a', append 'n' to the position minus last char
    if (before.endsWith(this.MIN_CHAR)) {
      const prefix = before.slice(0, -1);
      return prefix + this.MID_CHAR;
    }

    // Decrement the last character
    const prefix = before.slice(0, -1);
    const lastChar = before[before.length - 1];
    const prevChar = this.getPrevChar(lastChar);

    return prefix + prevChar;
  }

  /**
   * Generates a position string between two positions
   * @param before - The position before the new item (null = start)
   * @param after - The position after the new item (null = end)
   * @returns New position string between before and after
   */
  static generateBetween(before: string | null, after: string | null): string {
    // Handle edge cases
    if (!before && !after) {
      return this.generateFirst();
    }

    if (!before && after) {
      return this.generateBefore(after);
    }

    if (before && !after) {
      return this.generateAfter(before);
    }

    // Both positions exist - validate
    if (before! >= after!) {
      throw new Error('Invalid positions: before must be less than after');
    }

    // Find the first position where they differ
    const maxLength = Math.max(before!.length, after!.length);
    const beforePadded = before!.padEnd(maxLength, this.MIN_CHAR);
    const afterPadded = after!.padEnd(maxLength, this.MIN_CHAR);

    let result = '';

    for (let i = 0; i < maxLength; i++) {
      const beforeChar = beforePadded[i];
      const afterChar = afterPadded[i];

      if (beforeChar === afterChar) {
        result += beforeChar;
        continue;
      }

      // Found differing position
      const beforeCharCode = beforeChar.charCodeAt(0);
      const afterCharCode = afterChar.charCodeAt(0);

      // If adjacent characters, append mid char
      if (afterCharCode - beforeCharCode === 1) {
        result += beforeChar + this.MID_CHAR;
        return result;
      }

      // Calculate middle character
      const midCharCode = Math.floor((beforeCharCode + afterCharCode) / 2);
      result += String.fromCharCode(midCharCode);
      return result;
    }

    // If we get here, append mid char (shouldn't normally happen)
    return result + this.MID_CHAR;
  }

  /**
   * Generates multiple consecutive positions after a given position
   * @param after - The position to insert after
   * @param count - Number of positions to generate
   * @returns Array of position strings
   */
  static generateMultipleAfter(after: string, count: number): string[] {
    const positions: string[] = [];
    let current = after;

    for (let i = 0; i < count; i++) {
      current = this.generateAfter(current);
      positions.push(current);
    }

    return positions;
  }

  /**
   * Generates multiple consecutive positions before a given position
   * @param before - The position to insert before
   * @param count - Number of positions to generate
   * @returns Array of position strings
   */
  static generateMultipleBefore(before: string, count: number): string[] {
    const positions: string[] = [];
    let current = before;

    for (let i = 0; i < count; i++) {
      current = this.generateBefore(current);
      positions.unshift(current); // Add to beginning to maintain order
    }

    return positions;
  }

  /**
   * Validates if a position string is valid
   * @param position - Position string to validate
   * @returns true if valid
   */
  static isValid(position: string): boolean {
    if (!position || position.length === 0) {
      return false;
    }

    // Check all characters are lowercase letters
    return /^[a-z]+$/.test(position);
  }

  /**
   * Compares two position strings
   * @param a - First position
   * @param b - Second position
   * @returns -1 if a < b, 0 if equal, 1 if a > b
   */
  static compare(a: string, b: string): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  /**
   * Gets the next character in the alphabet
   */
  private static getNextChar(char: string): string {
    if (char === this.MAX_CHAR) {
      throw new Error('Cannot get next char after z');
    }
    const charCode = char.charCodeAt(0);
    return String.fromCharCode(charCode + 1);
  }

  /**
   * Gets the previous character in the alphabet
   */
  private static getPrevChar(char: string): string {
    if (char === this.MIN_CHAR) {
      throw new Error('Cannot get previous char before a');
    }
    const charCode = char.charCodeAt(0);
    return String.fromCharCode(charCode - 1);
  }

  /**
   * Utility to sort an array of items by their position strings
   * @param items - Array of items with position property
   * @param positionKey - Key name for the position property
   * @returns Sorted array
   */
  static sortByPosition<T extends Record<string, any>>(
    items: T[],
    positionKey: keyof T = 'position' as keyof T,
  ): T[] {
    return [...items].sort((a, b) => {
      const posA = a[positionKey] as string;
      const posB = b[positionKey] as string;
      return this.compare(posA, posB);
    });
  }

  /**
   * Rebalances positions when they get too long
   * Generates evenly distributed positions for all items
   * @param count - Number of items to generate positions for
   * @returns Array of position strings
   */
  static rebalance(count: number): string[] {
    const positions: string[] = [];
    const step = 26 / (count + 1); // Divide alphabet space evenly

    for (let i = 1; i <= count; i++) {
      const charCode = Math.floor(this.MIN_CHAR.charCodeAt(0) + step * i);
      positions.push(String.fromCharCode(charCode));
    }

    return positions;
  }
}