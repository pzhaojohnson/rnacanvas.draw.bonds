/**
 * @jest-environment jsdom
 */

import { StraightBond } from './StraightBond';

import * as SVG from '@svgdotjs/svg.js';

function createSVGLineElement() {
  let line = (new SVG.Line()).node;

  line.getTotalLength = () => 0;
  line.getPointAtLength = () => ({ x: 0, y: 0 });

  return line;
}

class NucleobaseMock {
  centerPoint = { x: 0, y: 0 };
}

describe('StraightBond class', () => {
  test('domNode getter', () => {
    let line = createSVGLineElement();

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());

    expect(sb.domNode).toBe(line);
    expect(line).toBeTruthy();
  });

  test('getAttribute method', () => {
    let line = createSVGLineElement();

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());

    line.setAttribute('stroke', '#5567ab');
    line.setAttribute('stroke-width', '2.63');

    expect(sb.getAttribute('stroke')).toBe('#5567ab');
    expect(sb.getAttribute('stroke-width')).toBe('2.63');
  });

  test('setAttribute method', () => {
    let line = createSVGLineElement();

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());

    sb.setAttribute('stroke', '#72bf89');
    sb.setAttribute('stroke-linecap', 'round');

    expect(line.getAttribute('stroke')).toBe('#72bf89');
    expect(line.getAttribute('stroke-linecap')).toBe('round');
  });

  describe('id getter', () => {
    it('returns the ID of the line element that is the straight bond', () => {
      let line = createSVGLineElement();

      line.setAttribute('id', 'line-38147827491827492');

      let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
      expect(sb.id).toBe('line-38147827491827492');
    });

    /**
     * Note that the `id` method provided by the SVG.js library for SVG elements
     * will auto-initialize IDs.
     */
    it('does not auto-initialize the ID', () => {
      let line = createSVGLineElement();
      expect(line.getAttribute('id')).toBeFalsy();

      let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
      expect(sb.id).toBeFalsy();

      // is still falsy too
      expect(line.getAttribute('id')).toBeFalsy();
    });
  });

  test('assignUUID method', () => {
    let sb = new StraightBond(createSVGLineElement(), new NucleobaseMock(), new NucleobaseMock());
    expect(sb.id).toBeFalsy();

    sb.assignUUID();
    expect(sb.id.length).toBeGreaterThanOrEqual(36);

    // must begin with a letter (per the rules for SVG element IDs)
    expect(sb.id.charAt(0)).toMatch(/[A-Za-z]/);
  });

  test('getTotalLength method', () => {
    let line = createSVGLineElement();
    line.getTotalLength = () => 18.0273994;

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
    expect(sb.getTotalLength()).toBe(18.0273994);
  });

  test('point1 getter', () => {
    let line = createSVGLineElement();

    line.getPointAtLength = length => length === 0 ? { x: 15.3819, y: -82.3718 } : { x: 0, y: 0 };

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
    expect(sb.point1).toStrictEqual({ x: 15.3819, y: -82.3718 });
  });

  test('point2 getter', () => {
    let line = createSVGLineElement();

    line.getTotalLength = () => 82.0028718;

    line.getPointAtLength = length => length === 82.0028718 ? { x: -9927.3, y: 48791.3 } : { x: 0, y: 0 };

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
    expect(sb.point2).toStrictEqual({ x: -9927.3, y: 48791.3 });
  });

  test('basePadding1 getter and setter', () => {
    let line = createSVGLineElement();
    line.getTotalLength = () => 19;
    line.getPointAtLength = length => ({ '0': { x: 18, y: 5 }, '19': { x: 37, y: 5 } }[length] ?? { x: 0, y: 0 });

    let base1 = new NucleobaseMock();
    let base2 = new NucleobaseMock();

    base1.centerPoint = { x: 15, y: 5 };
    base2.centerPoint = { x: 45, y: 5 };

    let sb = new StraightBond(line, base1, base2);
    expect(sb.basePadding1).toBeCloseTo(3);

    // must account for the movement of base 1
    base1.centerPoint = { x: 45, y: 50 };

    // has not changed yet
    expect(sb.basePadding1).toBeCloseTo(3);

    sb.basePadding1 = 7;
    expect(sb.basePadding1).toBeCloseTo(7);

    expect(Number.parseFloat(sb.getAttribute('x1'))).toBeCloseTo(45);
    expect(Number.parseFloat(sb.getAttribute('y1'))).toBeCloseTo(43);
    expect(Number.parseFloat(sb.getAttribute('x2'))).toBeCloseTo(45);
    expect(Number.parseFloat(sb.getAttribute('y2'))).toBeCloseTo(13);
  });

  test('basePadding2 getter and setter', () => {
    let line = createSVGLineElement();
    line.getTotalLength = () => 23;
    line.getPointAtLength = length => ({ '0': { x: 9, y: -6 }, '23': { x: 9, y: 24 } }[length]);

    let base1 = new NucleobaseMock();
    let base2 = new NucleobaseMock();

    base1.centerPoint = { x: 9, y: -8 };
    base2.centerPoint = { x: 9, y: 30 };

    let sb = new StraightBond(line, base1, base2);
    expect(sb.basePadding2).toBeCloseTo(6);

    // must account for the movement of base 2
    base2.centerPoint = { x: -30, y: -8 };

    // has not changed yet
    expect(sb.basePadding2).toBeCloseTo(6);

    sb.basePadding2 = 10.5;
    expect(sb.basePadding2).toBeCloseTo(10.5);

    expect(Number.parseFloat(sb.getAttribute('x1'))).toBeCloseTo(7);
    expect(Number.parseFloat(sb.getAttribute('y1'))).toBeCloseTo(-8);
    expect(Number.parseFloat(sb.getAttribute('x2'))).toBeCloseTo(-19.5);
    expect(Number.parseFloat(sb.getAttribute('y2'))).toBeCloseTo(-8);
  });

  describe('reposition method', () => {
    it('repositions the straight bond', () => {
      let line = createSVGLineElement();

      line.getTotalLength = () => 36.71511950137164;

      line.getPointAtLength = (
        length => length === 0 ? { x: 12, y: 84 } : length === 36.71511950137164 ? { x: 30, y: 52 } : { x: 0, y: 0 }
      );

      let base1 = new NucleobaseMock();
      let base2 = new NucleobaseMock();

      base1.centerPoint = { x: 9, y: 89 };
      base2.centerPoint = { x: 34, y: 50 };

      let sb = new StraightBond(line, base1, base2);

      // move bases 1 and 2
      base1.centerPoint = { x: 300, y: 500 };
      base2.centerPoint = { x: -120, y: -129 };

      sb.reposition();

      expect(Number.parseFloat(sb.getAttribute('x1'))).toBeCloseTo(296.76201248158316);
      expect(Number.parseFloat(sb.getAttribute('y1'))).toBeCloseTo(495.15072821646623);
      expect(Number.parseFloat(sb.getAttribute('x2'))).toBeCloseTo(-117.51657693904951);
      expect(Number.parseFloat(sb.getAttribute('y2'))).toBeCloseTo(-125.28077832062415);
    });

    it('sets opacity to zero if base paddings 1 and 2 overlap', () => {
      let line = createSVGLineElement();
      line.setAttribute('opacity', '1');

      line.getTotalLength = () => 10;

      line.getPointAtLength = (
        length => length === 0 ? { x: 25, y: 20 } : length === 10 ? { x: 35, y: 20 } : { x: 0, y: 0 }
      );

      let base1 = new NucleobaseMock();
      let base2 = new NucleobaseMock();

      base1.centerPoint = { x: 23, y: 20 };
      base2.centerPoint = { x: 44, y: 20 };

      let sb = new StraightBond(line, base1, base2);

      base1.centerPoint = { x: 21, y: 11 };
      base2.centerPoint = { x: 23.5, y: 14 };

      expect(line.getAttribute('opacity')).toBe('1');
      sb.reposition();
      expect(line.getAttribute('opacity')).toBe('0');
    });

    it('sets opacity to one if base paddings 1 and 2 do not overlap', () => {
      let line = createSVGLineElement();
      line.setAttribute('opacity', '0');

      line.getTotalLength = () => 10;

      line.getPointAtLength = (
        length => length === 0 ? { x: 25, y: 20 } : length === 10 ? { x: 35, y: 20 } : { x: 0, y: 0 }
      );

      let base1 = new NucleobaseMock();
      let base2 = new NucleobaseMock();

      base1.centerPoint = { x: 23, y: 20 };
      base2.centerPoint = { x: 44, y: 20 };

      let sb = new StraightBond(line, base1, base2);

      base1.centerPoint = { x: 21, y: 110 };
      base2.centerPoint = { x: 23.5, y: 14 };

      expect(line.getAttribute('opacity')).toBe('0');
      sb.reposition();
      expect(line.getAttribute('opacity')).toBe('1');
    });
  });
});
