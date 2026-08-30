export type DocsRouteTicket = {
  generation: number;
  signal: AbortSignal;
};

export class DocsRouteCoordinator {
  private generation = 0;
  private controller: AbortController | null = null;

  begin(): DocsRouteTicket {
    this.controller?.abort();
    this.controller = new AbortController();
    this.generation += 1;
    return { generation: this.generation, signal: this.controller.signal };
  }

  isCurrent(generation: number): boolean {
    return generation === this.generation && this.controller?.signal.aborted === false;
  }

  cancel(): void {
    this.controller?.abort();
    this.controller = null;
    this.generation += 1;
  }
}
