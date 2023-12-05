import type { MindElixirInstance } from '.'

export enum Actions {
  ADD_CHILD = 'addChild',
  ADD_PARENT = 'addParent',
  ADD_SIBLING = 'addSibling',
  REMOVE_NODE = 'removeNode',
  FOCUS = 'focus',
  UNFOCUS = 'unfocus',
  UP = 'up',
  DOWN = 'down',
  LINK = 'link',
  SUMMARY = 'summary',
}

export interface ContextMenuItem {
  key: string
  onClick: (mind: MindElixirInstance) => void
  shortcut?: string
  name?: string
  showInLeaf?: boolean
  showInRoot?: boolean
}
