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
   * Returns true if the nucleobase is a child of a parent container node.
   *
   * Returns false otherwise.
   */
  hasParent(): boolean;
}
