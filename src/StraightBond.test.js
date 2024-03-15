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
});
