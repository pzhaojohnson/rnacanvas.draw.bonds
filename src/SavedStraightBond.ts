import { StraightBond } from './StraightBond';

import type { Nucleobase } from './Nucleobase';

type NonNullObject = { [name: string]: unknown };

interface Drawing<B extends Nucleobase> {
  /**
   * The actual DOM node corresponding to the drawing and that is the drawing
   * (in this case an SVG document).
   */
  readonly domNode: SVGSVGElement;

  /**
   * All nucleobases in the drawing.
   */
  readonly bases: Iterable<B>;
}

/**
 * Represents a straight bond that has been saved (e.g., in a file)
 * and that can be recreated.
 */
export class SavedStraightBond<B extends Nucleobase> {
  #jsonSerializable: NonNullObject | unknown;

  #parentDrawing: Drawing<B>;

  /**
   * @param jsonSerializable The saved form of the straight bond (e.g., parsed from a file).
   * @param parentDrawing
   */
  constructor(jsonSerializable: NonNullObject | unknown, parentDrawing: Drawing<B>) {
    this.#jsonSerializable = jsonSerializable;

    this.#parentDrawing = parentDrawing;
  }

  #getID(name: string): string | never {
    let id: unknown = (this.#jsonSerializable as any)[name];

    if (!id) {
      throw new Error(`No ID with name "${name}" was saved.`);
    } else if (typeof id != 'string') {
      throw new Error(`The ID with name "${name}" is not a string: ${id}.`);
    }

    return id;
  }

  get #id(): string | never {
    // used to be saved under `lineId`
    try {
      return this.#getID('id');
    } catch {
      return this.#getID('lineId');
    }
  }

  get #domNode(): SVGLineElement | never {
    let id = this.#id;
    let domNode = this.#parentDrawing.domNode.querySelector(`#${id}`);

    if (!domNode) {
      throw new Error(`No DOM node in the drawing has the ID "${id}".`);
    } else if (!(domNode instanceof SVGLineElement)) {
      throw new Error(`The DOM node with ID "${id}" is not an SVG line element.`);
    }

    return domNode;
  }

  get #baseID1(): string | never {
    // used to be saved under `baseId1`
    try {
      return this.#getID('baseID1');
    } catch {
      return this.#getID('baseId1');
    }
  }

  get #baseID2(): string | never {
    // used to be saved under `baseId2`
    try {
      return this.#getID('baseID2');
    } catch {
      return this.#getID('baseId2');
    }
  }

  #getBase(num: 1 | 2): B | never {
    let baseID = { '1': this.#baseID1, '2': this.#baseID2 }[num];

    let b = [...this.#parentDrawing.bases].find(b => b.id === baseID);

    if (!b) {
      throw new Error(`No base in the drawing has the ID "${baseID}".`);
    }

    return b;
  }

  get #base1(): B | never {
    return this.#getBase(1);
  }

  get #base2(): B | never {
    return this.#getBase(2);
  }

  #getBasePadding(num: 1 | 2): number | never {
    let basePadding: unknown = (this.#jsonSerializable as any)[`basePadding${num}`];

    if (typeof basePadding != 'number') {
      throw new Error(`Saved base padding ${num} is not a number: ${basePadding}.`);
    }

    return basePadding;
  }

  get #basePadding1(): number | never {
    return this.#getBasePadding(1);
  }

  get #basePadding2(): number | never {
    return this.#getBasePadding(2);
  }

  /**
   * Recreates the saved straight bond.
   *
   * Throws if unable to do so.
   */
  recreate(): StraightBond<B> | never {
    let straightBond = new StraightBond(this.#domNode, this.#base1, this.#base2);

    try { straightBond.basePadding1 = this.#basePadding1; } catch {}
    try { straightBond.basePadding2 = this.#basePadding2; } catch {}

    return straightBond;
  }
}
