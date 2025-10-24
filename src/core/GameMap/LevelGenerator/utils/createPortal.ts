import { Portal, PortalParams } from '../../../../objects/portal/portal';

export function createPortal(options: PortalParams): Portal {
  return new Portal({
    startPosition: options.startPosition,
    size: options.size,
    onEnter: options.onEnter,
  });
}
