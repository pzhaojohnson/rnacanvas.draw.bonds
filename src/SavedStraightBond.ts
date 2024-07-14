import { StraightBond } from './StraightBond';

import type { Nucleobase } from './Nucleobase';

type NonNullObject = { [name: string]: unknown };

interface Drawing<B extends Nucleobase> {
  /**
   * Returns the SVG line element in the drawing with the specified ID.
   *
   * Throws if there is no SVG line element in the drawing with the specified ID.
   */
  getSVGLineElementWithID(id: string): SVGLineElement | never;

  /**
   * Returns the nucleobase in the drawing with the specified ID.
   *
   * Throws if there is no nucleobase in the drawing with the specified ID.
   */
  getBaseWithID(id: string): B | never;
}

/**
 * Represents a straight bond that has been saved (e.g., in a file)
 * and that can be recreated.
 */
export class SavedStraightBond<B extends Nucleobase> {
  #jsonSerializable: NonNullObject | unknown;

  #parentDrawing: Drawing<B>;

  /**
   * The saved form of a straight bond is supposed to be a non-null object.
   *
   * @param jsonSerializable The saved form of the straight bond (e.g., parsed from a file).
   * @param parentDrawing
   */
  constructor(jsonSerializable: NonNullObject | unknown, parentDrawing: Drawing<B>) {
    this.#jsonSerializable = jsonSerializable;

    this.#parentDrawing = parentDrawing;
  }

  #getProperty(name: string): unknown {
    return (this.#jsonSerializable as any)[name];
  }

  #getIDProperty(name: string): string | never {
    let id: unknown = this.#getProperty(name);

    if (!id) {
      throw new Error(`ID with name "${name}" is falsy.`);
    } else if (typeof id != 'string') {
      throw new Error(`ID with name "${name}" is not a string: ${id}.`);
    }

    return id;
  }

  get #id(): string | never {
    // used to be saved under the property name `lineId`
    try {
      return this.#getIDProperty('id');
    } catch {
      return this.#getIDProperty('lineId');
    }
  }

  get #baseID1(): string | never {
    // used to be saved under the property name `baseId1`
    try {
      return this.#getIDProperty('baseID1');
    } catch {
      return this.#getIDProperty('baseId1');
    }
  }

  get #baseID2(): string | never {
    // used to be saved under the property name `baseId2`
    try {
      return this.#getIDProperty('baseID2');
    } catch {
      return this.#getIDProperty('baseId2');
    }
  }

  #getBasePaddingProperty(name: string): number | never {
    let basePadding: unknown = this.#getProperty(name);

    if (typeof basePadding != 'number') {
      throw new Error(`Base padding property with name "${name}" is not a number: ${basePadding}.`);
    }

    return basePadding;
  }

  get #basePadding1(): number | never {
    return this.#getBasePaddingProperty('basePadding1');
  }

  get #basePadding2(): number | never {
    return this.#getBasePaddingProperty('basePadding2');
  }

  /**
   * Recreates the saved straight bond.
   *
   * Throws if unable to do so.
   */
  recreate(): StraightBond<B> | never {
    let line = this.#parentDrawing.getSVGLineElementWithID(this.#id);

    let base1 = this.#parentDrawing.getBaseWithID(this.#baseID1);
    let base2 = this.#parentDrawing.getBaseWithID(this.#baseID2);

    let straightBond = new StraightBond(line, base1, base2);

    try {
      straightBond.basePadding1 = this.#basePadding1;
      straightBond.basePadding2 = this.#basePadding2;
    } catch {}

    return straightBond;
  }
}
