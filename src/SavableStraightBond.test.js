import { SavableStraightBond } from './SavableStraightBond';

class StraightBondMock {
  id = 'id-928ufuweifj';

  base1 = { id: 'id-923r982u3fjie' };
  base2 = { id: 'id-jf2389ru9283ur9823' };

  basePadding1 = 0;
  basePadding2 = 0;
}

describe('SavableStraightBond class', () => {
  describe('toJSONSerializable method', () => {
    it('includes the ID of the straight bond', () => {
      let straightBond = new StraightBondMock();
      let savableStraightBond = new SavableStraightBond(straightBond);

      straightBond.id = 'id-jdf8j2983rj9283jriojef';

      expect(savableStraightBond.toJSONSerializable().id).toBe('id-jdf8j2983rj9283jriojef');
    });

    it('throws if the straight bond has a falsy ID', () => {
      let straightBond = new StraightBondMock();
      let savableStraightBond = new SavableStraightBond(straightBond);

      straightBond.id = '';

      expect(() => savableStraightBond.toJSONSerializable()).toThrow();
    });

    it('includes base IDs 1 and 2', () => {
      let straightBond = new StraightBondMock();
      let savableStraightBond = new SavableStraightBond(straightBond);

      straightBond.base1.id = 'id-cnasj9r82398r823rj';
      straightBond.base2.id = 'id-3819r9813ur98f3jf';

      expect(savableStraightBond.toJSONSerializable().baseID1).toBe('id-cnasj9r82398r823rj');
      expect(savableStraightBond.toJSONSerializable().baseID2).toBe('id-3819r9813ur98f3jf');
    });

    it('throws if either base 1 or 2 has a falsy ID', () => {
      let straightBond = new StraightBondMock();
      let savableStraightBond = new SavableStraightBond(straightBond);

      straightBond.base1.id = '';
      straightBond.base2.id = 'id-298r983uf98u3f'
      expect(() => savableStraightBond.toJSONSerializable()).toThrow();

      straightBond.base1.id = 'id-9849823urf8u2f';
      straightBond.base2.id = '';
      expect(() => savableStraightBond.toJSONSerializable()).toThrow();
    });

    it('includes base paddings 1 and 2', () => {
      let straightBond = new StraightBondMock();
      let savableStraightBond = new SavableStraightBond(straightBond);

      straightBond.basePadding1 = 6.1284912;
      straightBond.basePadding2 = 12.8492182;

      expect(savableStraightBond.toJSONSerializable().basePadding1).toBe(6.1284912);
      expect(savableStraightBond.toJSONSerializable().basePadding2).toBe(12.8492182);
    });

    it('returns an object that is JSON-serializable', () => {
      let straightBond = new StraightBondMock();
      let savableStraightBond = new SavableStraightBond(straightBond);

      expect(() => JSON.stringify(savableStraightBond.toJSONSerializable())).not.toThrow();
    });
  });
});
