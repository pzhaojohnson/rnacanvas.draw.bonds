import * as SVG from '@svgdotjs/svg.js';

import type { Nucleobase } from './Nucleobase';

/**
 * A bond that is a straight line between two bases.
 */
export class StraightBond {
  /**
   * @param line The line element that is the straight bond.
   * @param base1 Base 1 connected by the bond.
   * @param base2 Base 2 connected by the bond.
   */
  constructor(private line: SVG.Line, readonly base1: Nucleobase, readonly base2: Nucleobase) {}

  /**
   * The actual DOM node that is the straight bond
   * (i.e., the DOM node of its line element).
   */
  get domNode() {
    return this.line.node;
  }
}
