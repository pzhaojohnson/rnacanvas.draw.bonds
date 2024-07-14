import type { StraightBond } from './StraightBond';

import type { Nucleobase } from './Nucleobase';

type NonNullObject = { [name: string]: unknown };

/**
 * Represents a straight bond that can be saved (e.g., in a file)
 * for future drawing.
 */
export class SavableStraightBond<B extends Nucleobase> {
  #straightBond: StraightBond<B>;

  /**
   * @param straightBond A straight bond to wrap.
   */
  constructor(straightBond: StraightBond<B>) {
    this.#straightBond = straightBond;
  }

  /**
   * Returns an object that can be serialized to a JSON string
   * and that is the saved representation of the straight bond.
   *
   * Throws if the straight bond has a falsy ID
   * or if base 1 or 2 of the straight bond has a falsy ID.
   */
  toJSONSerializable(): NonNullObject | never {
    let id = this.#straightBond.id;
    let baseID1 = this.#straightBond.base1.id;
    let baseID2 = this.#straightBond.base2.id;

    if (!id) {
      throw new Error('Straight bond ID is falsy.');
    } else if (!baseID1) {
      throw new Error('Base ID 1 is falsy.');
    } else if (!baseID2) {
      throw new Error('Base ID 2 is falsy.');
    }

    let basePadding1 = this.#straightBond.basePadding1;
    let basePadding2 = this.#straightBond.basePadding2;

    return { id, baseID1, baseID2, basePadding1, basePadding2 };
  }
}
