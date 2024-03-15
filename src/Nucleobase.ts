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
  /**
   * Is gettable and settable.
   */
  centerPoint: Point;
}
