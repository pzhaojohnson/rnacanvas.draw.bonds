import * as SVG from '@svgdotjs/svg.js';

import type { Nucleobase } from './Nucleobase';

import { assignUUID } from '@rnacanvas/draw.svg';

/**
 * A bond that is a straight line between two bases.
 */
export class StraightBond<B extends Nucleobase> {
  /**
   * @param line The line element that is the straight bond.
   * @param base1 Base 1 connected by the bond.
   * @param base2 Base 2 connected by the bond.
   */
  constructor(private line: SVG.Line, readonly base1: B, readonly base2: B) {}

  /**
   * The actual DOM node that is the straight bond
   * (i.e., the DOM node of its line element).
   */
  get domNode() {
    return this.line.node;
  }

  /**
   * The `id` attribute of the line element that is the straight bond.
   */
  get id() {
    // don't use the `id` method provided by the SVG.js library
    // (since it will auto-initialize the `id` attribute of an SVG element)
    return this.domNode.id;
  }

  /**
   * Assigns a new UUID to the straight bond.
   *
   * (Overwrites any preexisting ID that the straight bond had.)
   */
  assignUUID(): void {
    assignUUID(this.line);
  }

  /**
   * The length of the line element that is the straight bond.
   */
  getTotalLength(): number {
    return this.domNode.getTotalLength();
  }
}
