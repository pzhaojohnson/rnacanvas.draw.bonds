import * as SVG from '@svgdotjs/svg.js';

import type { Nucleobase } from './Nucleobase';

import { assignUUID } from '@rnacanvas/draw.svg';

import { distance, direction } from '@rnacanvas/points';

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
  /**
   * Creates a new straight bond connecting bases 1 and 2.
   */
  static between<B extends Nucleobase>(base1: B, base2: B): StraightBond<B> {
    let line = (new SVG.Line()).node;
    let sb = new StraightBond(line, base1, base2);

    sb.assignUUID();

    // position the newly created straight bond
    sb.basePadding1 = 0;
    sb.basePadding2 = 0;

    return sb;
  }

  private cachedBasePadding1: number;
  private cachedBasePadding2: number;

  /**
   * @param line The line element that is the straight bond.
   * @param base1 Base 1 connected by the bond.
   * @param base2 Base 2 connected by the bond.
   */
  constructor(private line: SVGLineElement, readonly base1: B, readonly base2: B) {
    this.cachedBasePadding1 = distance(this.point1, this.base1.centerPoint);
    this.cachedBasePadding2 = distance(this.point2, this.base2.centerPoint);
  }

  /**
   * The two bases bound by the straight bond.
   *
   * In the returned base-pair, the two bases bound by the straight bond
   * will be ordered base 1 and then base 2.
   */
  get basePair(): [B, B] {
    return [this.base1, this.base2];
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
    assignUUID(this.domNode);
  }

  /**
   * Appends the line element that is the straight bond to the given container node.
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the line element that is the straight bond from its parent container node.
   *
   * Has no effect if the straight bond (line element) had no parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  /**
   * Returns true if the line element that is the straight bond is a child (or grandchild, great-grandchild, etc.)
   * of the given container node.
   *
   * Returns false otherwise, including if the given container node is the straight bond (line element) itself.
   */
  isIn(container: Node): boolean {
    return container.contains(this.domNode) && container !== this.domNode;
  }

  /**
   * Returns true if the line element that is the straight bond is a child of any sort of parent container node.
   *
   * Returns false otherwise.
   */
  hasParent(): boolean {
    return this.domNode.parentNode ? true : false;
  }

  /**
   * The length of the line element that is the straight bond.
   */
  getTotalLength(): number {
    return this.domNode.getTotalLength();
  }

  /**
   * Get a point along the length of the straight bond (going from point 1 to point 2).
   */
  getPointAtLength(length: number): Point {
    return this.domNode.getPointAtLength(length);
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

  /**
   * Will reposition the straight bond.
   */
  set basePadding1(basePadding1) {
    this.cachedBasePadding1 = basePadding1;
    this.reposition();
  }

  /**
   * The distance that point 2 is meant to be from base 2 of the straight bond.
   *
   * Note that this is not the same thing as the current distance between point 2 and base 2 of the straight bond.
   *
   * (This is to allow for proper repositioning of the straight bond after its bases have been moved.)
   */
  get basePadding2(): number {
    return this.cachedBasePadding2;
  }

  /**
   * Will reposition the straight bond.
   */
  set basePadding2(basePadding2) {
    this.cachedBasePadding2 = basePadding2;
    this.reposition();
  }

  /**
   * Repositions the straight bond based on the current positions of bases 1 and 2.
   */
  reposition(): void {
    let centerPoint1 = this.base1.centerPoint;
    let centerPoint2 = this.base2.centerPoint;

    let a = direction(centerPoint1, centerPoint2);

    this.setAttribute('x1', `${centerPoint1.x + (this.basePadding1 * Math.cos(a))}`);
    this.setAttribute('y1', `${centerPoint1.y + (this.basePadding1 * Math.sin(a))}`);
    this.setAttribute('x2', `${centerPoint2.x - (this.basePadding2 * Math.cos(a))}`);
    this.setAttribute('y2', `${centerPoint2.y - (this.basePadding2 * Math.sin(a))}`);
  }

  /**
   * Signals to the straight bond that bases have moved,
   * causing necessary follow-up actions to be performed
   * (e.g., repositioning the straight bond).
   */
  basesMoved(): void {
    this.reposition();
  }

  /**
   * Signals to the straight bond that bases have been removed,
   * causing necessary follow-up actions to be performed.
   *
   * If either base 1 or 2 of the straight bond lacks a parent container node (i.e., was removed),
   * then the straight bond will remove itself from any parent container node that it is in.
   */
  basesRemoved(): void {
    if (!this.base1.hasParent() || !this.base2.hasParent()) {
      this.remove();
    }
  }
}
