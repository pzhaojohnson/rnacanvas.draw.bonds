/**
 * @jest-environment jsdom
 */

import { SavedStraightBond } from './SavedStraightBond';

const SVGLineElementMock = {
  create: () => {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.x1 = { baseVal: { value: 0 } };
    line.y1 = { baseVal: { value: 0 } };
    line.x2 = { baseVal: { value: 0 } };
    line.y2 = { baseVal: { value: 0 } };

    return line;
  },
}

class NucleobaseMock {
  id = `id-${Math.random()}`;

  centerPoint = { x: 0, y: 0 };

  addEventListener() {}
}

class DrawingMock {
  constructor() {
    this.domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'line'));

    this.bases = [
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
      new NucleobaseMock(),
    ];
  }

  getSVGLineElementWithID(id) {
    let line = [...this.domNode.children].find(ele => ele.id === id && ele.tagName == 'line');

    if (!line) {
      throw new Error(`This drawing does not contain an SVG line element with the ID: "${id}".`);
    }

    return line;
  }

  getBaseWithID(id) {
    let b = this.bases.find(b => b.id === id);

    if (!b) {
      throw new Error(`This drawing does not contain a nucleobase with the ID: "${id}".`);
    }

    return b;
  }
}

describe('SavedStraightBond class', () => {
  describe('recreate method', () => {
    it('retrieves the correct SVG line element', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[4]);

      let savedStraightBond = new SavedStraightBond(
        { id, baseID1: parentDrawing.bases[0].id, baseID2: parentDrawing.bases[1].id },
        parentDrawing,
      );

      expect(savedStraightBond.recreate().id).toBe(id);
    });

    it('checks if the straight bond ID was saved under `lineId`', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[4]);

      let savedStraightBond = new SavedStraightBond(
        { lineId: id, baseID1: parentDrawing.bases[0].id, baseID2: parentDrawing.bases[1].id },
        parentDrawing,
      );

      expect(savedStraightBond.recreate().id).toBe(id);
    });

    it('throws if the straight bond ID was not saved', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[4]);

      let savedStraightBond = new SavedStraightBond(
        { baseID1: parentDrawing.bases[0].id, baseID2: parentDrawing.bases[1].id },
        parentDrawing,
      );

      expect(() => savedStraightBond.recreate()).toThrow();
    });

    it('retrieves bases 1 and 2', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[3]);

      let savedStraightBond = new SavedStraightBond(
        { id, baseID1: parentDrawing.bases[5].id, baseID2: parentDrawing.bases[2].id },
        parentDrawing,
      );

      expect(savedStraightBond.recreate().base1.id).toBe(parentDrawing.bases[5].id);
      expect(savedStraightBond.recreate().base2.id).toBe(parentDrawing.bases[2].id);
    });

    it('checks if base IDs 1 and 2 were saved as `baseId1` or `baseId2`', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[4]);

      let savedStraightBond = new SavedStraightBond(
        { id, baseId1: parentDrawing.bases[5].id, baseId2: parentDrawing.bases[2].id },
        parentDrawing,
      );

      expect(savedStraightBond.recreate().base1.id).toBe(parentDrawing.bases[5].id);
      expect(savedStraightBond.recreate().base2.id).toBe(parentDrawing.bases[2].id);
    });

    it('throws if either base ID 1 or 2 was not saved', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[4]);

      let savedStraightBond = new SavedStraightBond(
        { id, baseID2: parentDrawing.bases[2].id },
        parentDrawing,
      );

      expect(() => savedStraightBond.recreate()).toThrow();

      savedStraightBond = new SavedStraightBond(
        { id, baseID1: parentDrawing.bases[2].id },
        parentDrawing,
      );

      expect(() => savedStraightBond.recreate()).toThrow();
    });

    it('restores base paddings 1 and 2', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[3]);

      let savedStraightBond = new SavedStraightBond(
        {
          id, baseID1: parentDrawing.bases[0].id, baseID2: parentDrawing.bases[1].id,
          basePadding1: 23.149119, basePadding2: 32.3891,
        },
        parentDrawing,
      );

      expect(savedStraightBond.recreate().basePadding1).toBeCloseTo(23.149119);
      expect(savedStraightBond.recreate().basePadding2).toBeCloseTo(32.3891);
    });

    it('does not modify base paddings if no base paddings were saved', () => {
      let id = 'id-duf98u298fu2938fu';

      let line = SVGLineElementMock.create();
      line.id = id;

      let parentDrawing = new DrawingMock();
      parentDrawing.domNode.insertBefore(line, parentDrawing.domNode.childNodes[3]);

      let savedStraightBond = new SavedStraightBond(
        { id, baseID1: parentDrawing.bases[0].id, baseID2: parentDrawing.bases[1].id },
        parentDrawing,
      );

      expect(savedStraightBond.recreate().basePadding1).toBe(0);
      expect(savedStraightBond.recreate().basePadding2).toBe(0);
    });
  });
});
