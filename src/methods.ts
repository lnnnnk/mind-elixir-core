import * as customLink from './customLink'
import type { MindElixirData, MindElixirInstance } from './index'
import * as interact from './interact'
import linkDiv from './linkDiv'
import * as nodeOperation from './nodeOperation'
import contextMenu from './plugin/contextMenu'
import * as exportImage from './plugin/exportImage'
import keypress from './plugin/keypress'
import mobileMenu from './plugin/mobileMenu'
import nodeDraggable from './plugin/nodeDraggable'
import operationHistory from './plugin/operationHistory'
import selection from './plugin/selection'
import toolBar from './plugin/toolBar'
import * as summaryOperation from './summary'
import { createChildren, createParent, createTopic, createWrapper, editTopic, findEle } from './utils/dom'
import { fillParent, generateNewObj, getObjById, isMobile } from './utils/index'
import { layout } from './utils/layout'
import changeTheme from './utils/theme'

export type OperationMap = typeof nodeOperation
export type Operations = keyof OperationMap
type NodeOperation = {
  [K in Operations]: ReturnType<typeof beforeHook<K>>
}

function beforeHook<T extends Operations>(
  fn: OperationMap[T],
  fnName: T
): (this: MindElixirInstance, ...args: Parameters<OperationMap[T]>) => Promise<void> {
  return async function (this: MindElixirInstance, ...args: Parameters<OperationMap[T]>) {
    const hook = this.before[fnName]
    if (hook) {
      const res = await hook.apply(this, args)
      if (!res) return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(fn as any).apply(this, args)
  }
}

const operations = Object.keys(nodeOperation) as Array<Operations>
const nodeOperationHooked: Partial<NodeOperation> = {}
if (import.meta.env.MODE !== 'lite') {
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i]
    nodeOperationHooked[operation] = beforeHook(nodeOperation[operation], operation)
  }
}

export type MindElixirMethods = typeof methods

/**
 * Methods that mind-elixir instance can use
 *
 * @public
 */
const methods = {
  getObjById,
  generateNewObj,
  layout,
  linkDiv,
  editTopic,
  createWrapper,
  createParent,
  createChildren,
  createTopic,
  findEle,
  changeTheme,
  ...interact,
  ...(nodeOperationHooked as NodeOperation),
  ...customLink,
  ...summaryOperation,
  ...exportImage,
  init(this: MindElixirInstance, data: MindElixirData) {
    if (!data || !data.nodeData) return new Error('MindElixir: `data` is required')
    if (data.direction !== undefined) {
      this.direction = data.direction
    }
    this.changeTheme(data.theme || this.theme, false)
    this.nodeData = data.nodeData
    fillParent(this.nodeData)
    this.linkData = data.linkData || {}
    this.summaries = data.summaries || []
    this.tidyCustomLink()
    // plugins
    this.toolBar && toolBar(this)
    if (import.meta.env.MODE !== 'lite') {
      this.keypress && keypress(this)

      if (this.editable) {
        selection(this)
      }
      if (isMobile() && this.mobileMenu) {
        mobileMenu(this)
      } else {
        this.contextMenu && contextMenu(this, this.contextMenu)
      }
      this.draggable && nodeDraggable(this)
      this.allowUndo && operationHistory(this)
    }
    this.toCenter()
    this.layout()
    this.linkDiv()
  },
}

export default methods
