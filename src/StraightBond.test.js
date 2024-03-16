/**
 * @jest-environment jsdom
 */

import { StraightBond } from './StraightBond';

import * as SVG from '@svgdotjs/svg.js';

class LineMock {
  getAttribute = () => {};
  setAttribute = () => {};

  id = '';

  getTotalLength = () => 0;
}

class NucleobaseMock {
  centerPoint = { x: 0, y: 0 };
}

describe('StraightBond class', () => {
  test('domNode getter', () => {
    let line = (new SVG.Line()).node;

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());

    expect(sb.domNode).toBe(line);
    expect(line).toBeTruthy();
  });

  describe('id getter', () => {
    it('returns the ID of the line element that is the straight bond', () => {
      let line = (new SVG.Line()).node;
      line.setAttribute('id', 'line-38147827491827492');

      let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
      expect(sb.id).toBe('line-38147827491827492');
    });

    /**
     * Note that the `id` method provided by the SVG.js library for SVG elements
     * will auto-initialize IDs.
     */
    it('does not auto-initialize the ID', () => {
      let line = (new SVG.Line()).node;
      expect(line.getAttribute('id')).toBeFalsy();

      let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
      expect(sb.id).toBeFalsy();

      // is still falsy too
      expect(line.getAttribute('id')).toBeFalsy();
    });
  });

  test('assignUUID method', () => {
    let sb = new StraightBond((new SVG.Line()).node, new NucleobaseMock(), new NucleobaseMock());
    expect(sb.id).toBeFalsy();

    sb.assignUUID();
    expect(sb.id.length).toBeGreaterThanOrEqual(36);
  });

  test('getTotalLength method', () => {
    let line = new LineMock();
    line.getTotalLength = () => 18.0273994;

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
    expect(sb.getTotalLength()).toBe(18.0273994);
  });
});
