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

  describe('basePadding1 getter', () => {
    it('returns the initial distance between base 1 and point 1 of the straight bond', () => {
      let line = createSVGLineElement();
      line.getPointAtLength = length => length === 0 ? { x: 82.7, y: 101.8 } : { x: 0, y: 0 };

      let base1 = new NucleobaseMock();
      base1.centerPoint = { x: 72, y: 86 };

      let sb = new StraightBond(line, base1, new NucleobaseMock());
      expect(sb.basePadding1).toBeCloseTo(19.08219064992277);
    });

    test('its returned value is not affected by the movement of bases', () => {
      let line = createSVGLineElement();
      line.getPointAtLength = length => length === 0 ? { x: 50, y: 62 } : { x: 0, y: 0 };

      let base1 = new NucleobaseMock();
      base1.centerPoint = { x: 68, y: 33 };

      let sb = new StraightBond(line, base1, new NucleobaseMock());

      // move base 1
      base1.centerPoint = { x: 500, y: 200 };

      expect(sb.basePadding1).toBeCloseTo(34.132096331752024);
    });
  });
});
