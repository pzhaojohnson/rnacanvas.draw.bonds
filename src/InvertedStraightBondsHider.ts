interface StraightBond {
  /**
   * The DOM node corresponding to the straight bond.
   */
  domNode: Node;

  /**
   * Returns true if the straight bond is inverted and returns false otherwise.
   */
  isInverted(): boolean;

  setAttribute(name: 'opacity', value: string): void;
}

/**
 * A live collection of items that may change over time
 * and whose contents are expected to always be up-to-date.
 */
interface LiveCollection<T> extends Iterable<T> {}

/**
 * Automatically hides straight bonds that become inverted
 * by setting their `opacity` attributes to zero.
 *
 * Also automatically unhides straight bonds that have stopped being inverted
 * by setting their `opacity` attributes to one.
 *
 * This class will overwrite any previously set `opacity` attribute values on straight bonds.
 */
export class InvertedStraightBondsHider {
  /**
   * @param targetStraightBonds The straight bonds to hide when they become inverted.
   * @param parentSVGDoc The SVG document that the target straight bonds are in.
   */
  constructor(private targetStraightBonds: LiveCollection<StraightBond>, parentSVGDoc: SVGSVGElement) {
    let movementObserver = new MutationObserver(mutations => {
      let targetStraightBondDOMNodes = new Set([...this.targetStraightBonds].map(sb => sb.domNode));
      mutations.some(mut => targetStraightBondDOMNodes.has(mut.target)) ? this.updateOpacities() : {};
    });

    // watch for when any straight bonds move
    movementObserver.observe(parentSVGDoc, { attributes: true, attributeFilter: ['x1', 'y1', 'x2', 'y2'], subtree: true });
  }

  private updateOpacities(): void {
    [...this.targetStraightBonds].forEach(sb => {
      let opacity = sb.isInverted() ? '0' : '1';
      sb.setAttribute('opacity', opacity);
    });
  }
}
