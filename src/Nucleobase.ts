/**
 * A two-dimensional point.
 */
export type Point = {
  x: number;
  y: number;
};

/**
 * The nucleobase interface used by bonds.
 */
export interface Nucleobase {
  readonly centerPoint: Point;

  /**
   * Allows one to listen for when the nucleobase moves (i.e., its center point changes).
   */
  addEventListener(eventName: 'move', listener: () => void): void;
}
