"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface DragReorderListProps<T> {
  items: T[]
  getId: (item: T) => string
  onReorder: (newItems: T[]) => void
  renderItem: (item: T, index: number, state: { isDragging: boolean; isDropTarget: boolean }) => React.ReactNode
  className?: string
  itemClassName?: string
  as?: "div" | "ul" | "fragment"
  itemAs?: "div" | "tr"
}

export function DragReorderList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  className,
  itemClassName,
  as = "div",
  itemAs = "div",
}: DragReorderListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(index))
  }

  const handleDragOver = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const [removed] = newItems.splice(draggedIndex, 1)
    if (removed !== undefined) {
      newItems.splice(targetIndex, 0, removed)
    }

    onReorder(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const ItemTag = itemAs

  const children = items.map((item, index) => (
    <ItemTag
      key={getId(item)}
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, index)}
      onDragEnd={handleDragEnd}
      className={cn(itemClassName)}
    >
      {renderItem(item, index, {
        isDragging: draggedIndex === index,
        isDropTarget: dragOverIndex === index && draggedIndex !== index,
      })}
    </ItemTag>
  ))

  if (as === "fragment") {
    return <>{children}</>
  }

  const Wrapper = as
  return <Wrapper className={className}>{children}</Wrapper>
}
