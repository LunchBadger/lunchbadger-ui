export default (entityId, tab, autoscrollSelector) => window.dispatchEvent(
  new CustomEvent('openDetailsPanelWithAutoscroll', {detail: {
    entityId,
    tab,
    autoscrollSelector
  }})
);
