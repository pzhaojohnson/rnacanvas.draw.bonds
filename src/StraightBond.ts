import { SVG } from '@svgdotjs/svg.js';

import type { Nucleobase } from './Nucleobase';

import { assignUUID } from '@rnacanvas/draw.svg';

import { distance } from '@rnacanvas/points';

/**
 * A two-dimensional point.
 */
export type Point = {
  x: number;
  y: number;
};

/**
 * A bond that is a straight line between two bases.
 */
export class StraightBond<B extends Nucleobase> {
  private cachedBasePadding1: number;

  /**
   * @param line The line element that is the straight bond.
   * @param base1 Base 1 connected by the bond.
   * @param base2 Base 2 connected by the bond.
   */
  constructor(private line: SVGLineElement, readonly base1: B, readonly base2: B) {
    this.cachedBasePadding1 = distance(this.point1, this.base1.centerPoint);
  }

  /**
   * The actual DOM node of the line element that is the straight bond.
   */
  get domNode() {
    return this.line;
  }

  /**
   * Get an attribute of the line element that is the straight bond.
   */
  getAttribute(name: string) {
    return this.domNode.getAttribute(name);
  }

  /**
   * Set an attribute of the line element that is the straight bond.
   */
  setAttribute(name: string, value: string): void {
    this.domNode.setAttribute(name, value);
  }

  /**
   * The `id` property of the line element that is the straight bond.
   */
  get id() {
    // don't use the `id` method provided by the SVG.js library for SVG elements
    // (since it will auto-initialize IDs)
    return this.domNode.id;
  }

  /**
   * Assigns a new UUID to the straight bond.
   *
   * (Overwrites any preexisting ID that the straight bond had.)
   */
  assignUUID(): void {
    assignUUID(SVG(this.line));
  }

  /**
   * The length of the line element that is the straight bond.
   */
  getTotalLength(): number {
    return this.domNode.getTotalLength();
  }

  /**
   * The point connecting with base 1 of the straight bond.
   */
  get point1(): Point {
    return this.domNode.getPointAtLength(0);
  }

  /**
   * The point connecting with base 2 of the straight bond.
   */
  get point2(): Point {
    return this.domNode.getPointAtLength(this.getTotalLength());
  }

  /**
   * The distance that point 1 is meant to be from base 1 of the straight bond.
   *
   * Note that this is not the same thing as the current distance between point 1 and base 1 of the straight bond.
   *
   * (This is to allow for proper repositioning of the straight bond after its bases have been moved.)
   */
  get basePadding1(): number {
    return this.cachedBasePadding1;
  }
}
