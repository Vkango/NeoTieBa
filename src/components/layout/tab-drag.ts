export interface DragTabLayout {
  id: number;
  left: number;
  width: number;
  // Includes the trailing margin/gap, measured without CSS transforms.
  span: number;
}

export function getTabDragPreview(layout: readonly DragTabLayout[], id: number, offset: number) {
  const dragged = layout.find(tab => tab.id === id);
  if (!dragged) return { order: layout.map(tab => tab.id), offsets: new Map<number, number>() };

  const center = dragged.left + dragged.width / 2 + offset;
  const others = layout.filter(tab => tab.id !== id);
  // Thresholds stay in the original coordinate system throughout the gesture.
  // Neither the grab point nor animated neighbor positions affect insertion.
  const target = others.filter(tab => center > tab.left + tab.width / 2).length;
  const order = [...others];
  order.splice(target, 0, dragged);
  const offsets = new Map<number, number>();
  let left = layout[0]?.left ?? 0;
  for (const tab of order) {
    offsets.set(tab.id, tab.id === id ? offset : left - tab.left);
    left += tab.span;
  }
  return { order: order.map(tab => tab.id), offsets };
}
