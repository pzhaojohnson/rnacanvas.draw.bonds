/**
 * @jest-environment jsdom
 */

import { StraightBond } from './StraightBond';

import * as SVG from '@svgdotjs/svg.js';

class NucleobaseMock {
  centerPoint = { x: 0, y: 0 };
}

describe('StraightBond class', () => {
  test('domNode getter', () => {
    let line = new SVG.Line();

    let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());

    expect(sb.domNode).toBe(line.node);
    expect(line.node).toBeTruthy();
  });

  describe('id getter', () => {
    it('returns the ID of the line element for the straight bond', () => {
      let line = new SVG.Line();
      line.node.setAttribute('id', 'line-38147827491827492');

      let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
      expect(sb.id).toBe('line-38147827491827492');
    });

    it('does not auto-initialize the ID', () => {
      let line = new SVG.Line();
      expect(line.node.getAttribute('id')).toBe(null);

      let sb = new StraightBond(line, new NucleobaseMock(), new NucleobaseMock());
      expect(sb.id).toBe(null);

      // is still null too
      expect(line.node.getAttribute('id')).toBe(null);
    });
  });
});
