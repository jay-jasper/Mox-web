import { describe, expect, it } from 'vitest';
import { DocsRouteCoordinator } from '../src/lib/docs-router';

describe('DocsRouteCoordinator', () => {
  it('aborts stale navigation and only lets the latest generation commit', () => {
    const coordinator = new DocsRouteCoordinator();
    const first = coordinator.begin();
    const second = coordinator.begin();

    expect(first.signal.aborted).toBe(true);
    expect(coordinator.isCurrent(first.generation)).toBe(false);
    expect(second.signal.aborted).toBe(false);
    expect(coordinator.isCurrent(second.generation)).toBe(true);
  });
});
