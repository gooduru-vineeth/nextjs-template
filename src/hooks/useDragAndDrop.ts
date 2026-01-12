'use client';

import { useCallback, useState } from 'react';

export type DragAndDropOptions<T> = {
  items: T[];
  onReorder: (newItems: T[]) => void;
  getItemId: (item: T) => string;
};

export type DragAndDropReturn<T> = {
  draggedItemId: string | null;
  dragOverItemId: string | null;
  handleDragStart: (e: React.DragEvent, item: T) => void;
  handleDragOver: (e: React.DragEvent, item: T) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent, item: T) => void;
  isDragging: boolean;
  getDragHandleProps: (item: T) => {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    onDrop: (e: React.DragEvent) => void;
    className: string;
  };
};

export function useDragAndDrop<T>({
  items,
  onReorder,
  getItemId,
}: DragAndDropOptions<T>): DragAndDropReturn<T> {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: T) => {
    const id = getItemId(item);
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);

    // Add a slight delay to show drag effect
    const target = e.target as HTMLElement;
    setTimeout(() => {
      target.style.opacity = '0.5';
    }, 0);
  }, [getItemId]);

  const handleDragOver = useCallback((e: React.DragEvent, item: T) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const id = getItemId(item);
    if (id !== draggedItemId) {
      setDragOverItemId(id);
    }
  }, [draggedItemId, getItemId]);

  const handleDragEnd = useCallback(() => {
    // Reset opacity on all draggable elements
    const draggables = document.querySelectorAll('[draggable="true"]');
    draggables.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
    });

    setDraggedItemId(null);
    setDragOverItemId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetItem: T) => {
    e.preventDefault();

    if (!draggedItemId) {
      return;
    }

    const targetId = getItemId(targetItem);
    if (draggedItemId === targetId) {
      handleDragEnd();
      return;
    }

    // Find indices
    const draggedIndex = items.findIndex(item => getItemId(item) === draggedItemId);
    const targetIndex = items.findIndex(item => getItemId(item) === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      handleDragEnd();
      return;
    }

    // Create new array with reordered items
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    if (draggedItem) {
      newItems.splice(targetIndex, 0, draggedItem);
    }

    onReorder(newItems);
    handleDragEnd();
  }, [draggedItemId, items, getItemId, onReorder, handleDragEnd]);

  const getDragHandleProps = useCallback((item: T) => {
    const id = getItemId(item);
    const isDraggedOver = dragOverItemId === id && draggedItemId !== id;

    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, item),
      onDragOver: (e: React.DragEvent) => handleDragOver(e, item),
      onDragEnd: handleDragEnd,
      onDrop: (e: React.DragEvent) => handleDrop(e, item),
      className: isDraggedOver
        ? 'border-t-2 border-blue-500'
        : '',
    };
  }, [getItemId, dragOverItemId, draggedItemId, handleDragStart, handleDragOver, handleDragEnd, handleDrop]);

  return {
    draggedItemId,
    dragOverItemId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    isDragging: draggedItemId !== null,
    getDragHandleProps,
  };
}
