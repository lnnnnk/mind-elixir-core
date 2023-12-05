import type { MindElixirInstance, Theme, Topic } from '.'
import i18n from './i18n'
import type { ContextMenuItem } from './types/contextmenu'
import { Actions } from './types/contextmenu'
import { createTips } from './utils'

export const LEFT = 0
export const RIGHT = 1
export const SIDE = 2
export const DOWN = 3

export const GAP = 30 // must sync with --gap in index.less

export const TURNPOINT_R = 8
export const THEME: Theme = {
  name: 'Latte',
  palette: ['#dd7878', '#ea76cb', '#8839ef', '#e64553', '#fe640b', '#df8e1d', '#40a02b', '#209fb5', '#1e66f5', '#7287fd'],
  cssVar: {
    '--main-color': '#444446',
    '--main-bgcolor': '#ffffff',
    '--color': '#777777',
    '--bgcolor': '#f6f6f6',
    '--panel-color': '#444446',
    '--panel-bgcolor': '#ffffff',
    '--panel-border-color': '#eaeaea',
  },
}

export const DARK_THEME: Theme = {
  name: 'Dark',
  palette: ['#848FA0', '#748BE9', '#D2F9FE', '#4145A5', '#789AFA', '#706CF4', '#EF987F', '#775DD5', '#FCEECF', '#DA7FBC'],
  cssVar: {
    '--main-color': '#ffffff',
    '--main-bgcolor': '#4c4f69',
    '--color': '#cccccc',
    '--bgcolor': '#252526',
    '--panel-color': '#ffffff',
    '--panel-bgcolor': '#2d3748',
    '--panel-border-color': '#696969',
  },
}

export const actionMapping: Record<Actions, ContextMenuItem> = {
  [Actions.ADD_CHILD]: {
    key: Actions.ADD_CHILD,
    name: i18n['cn'][Actions.ADD_CHILD as string],
    onClick: (mind: MindElixirInstance) => {
      mind.addChild()
    },
    shortcut: 'tab',
    showInRoot: true,
    showInLeaf: false,
  },
  [Actions.ADD_PARENT]: {
    key: Actions.ADD_PARENT,
    name: i18n['cn'][Actions.ADD_PARENT as string],
    onClick: (mind: MindElixirInstance) => {
      mind.insertParent()
    },
    shortcut: '',
    showInRoot: false,
    showInLeaf: true,
  },
  [Actions.ADD_SIBLING]: {
    key: Actions.ADD_SIBLING,
    name: i18n['cn'][Actions.ADD_SIBLING as string],
    onClick: (mind: MindElixirInstance) => {
      mind.insertSibling()
    },
    shortcut: 'enter',
    showInRoot: false,
    showInLeaf: true,
  },
  [Actions.REMOVE_NODE]: {
    key: Actions.REMOVE_NODE,
    name: i18n['cn'][Actions.REMOVE_NODE as string],
    onClick: (mind: MindElixirInstance) => {
      mind.removeNode()
    },
    shortcut: 'delete',
    showInRoot: false,
    showInLeaf: true,
  },
  [Actions.FOCUS]: {
    key: Actions.FOCUS,
    name: i18n['cn'][Actions.FOCUS as string],
    onClick: (mind: MindElixirInstance) => {
      mind.focusNode(mind.currentNode as Topic)
    },
    shortcut: '',
    showInRoot: false,
    showInLeaf: false,
  },
  [Actions.UNFOCUS]: {
    key: Actions.UNFOCUS,
    name: i18n['cn'][Actions.UNFOCUS as string],
    onClick: (mind: MindElixirInstance) => {
      mind.cancelFocus()
    },
    shortcut: '',
    showInRoot: false,
    showInLeaf: false,
  },
  [Actions.UP]: {
    key: Actions.UP,
    name: i18n['cn'][Actions.UP as string],
    onClick: (mind: MindElixirInstance) => {
      mind.moveUpNode()
    },
    shortcut: 'PgUp',
    showInRoot: false,
    showInLeaf: true,
  },
  [Actions.DOWN]: {
    key: Actions.DOWN,
    name: i18n['cn'][Actions.DOWN as string],
    onClick: (mind: MindElixirInstance) => {
      mind.moveDownNode()
    },
    shortcut: 'Pgdn',
    showInRoot: false,
    showInLeaf: true,
  },
  [Actions.LINK]: {
    key: Actions.LINK,
    name: i18n['cn'][Actions.LINK as string],
    onClick: (mind: MindElixirInstance) => {
      const from = mind.currentNode as Topic
      const tips = createTips(i18n['cn'].clickTips)
      mind.container.appendChild(tips)
      mind.map.addEventListener(
        'click',
        e => {
          e.preventDefault()
          tips.remove()
          const target = e.target as Topic
          if (target.parentElement.tagName === 'ME-PARENT' || target.parentElement.tagName === 'ME-ROOT') {
            mind.createLink(from, target)
          } else {
            console.log('link cancel')
          }
        },
        {
          once: true,
        }
      )
    },
    shortcut: '',
    showInRoot: true,
    showInLeaf: true,
  },
  [Actions.SUMMARY]: {
    key: Actions.SUMMARY,
    name: i18n['cn'][Actions.SUMMARY as string],
    onClick: (mind: MindElixirInstance) => {
      mind.createSummary()
      mind.unselectNodes()
    },
    shortcut: 'Pgdn',
    showInRoot: false,
    showInLeaf: true,
  },
}
