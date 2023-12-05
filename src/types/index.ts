import type SelectionArea from '@viselect/vanilla'
import type { LinkItem } from '../customLink'
import type { MindElixirMethods, OperationMap, Operations } from '../methods'
import type { Summary, SummarySvgGroup } from '../summary'
import type { LinkDragMoveHelperInstance } from '../utils/LinkDragMoveHelper'
import type Bus from '../utils/pubsub'
import type { EventMap, Operation } from '../utils/pubsub'
import type { Actions, ContextMenuItem } from './contextmenu'
import type { CustomSvg, Topic } from './dom'
export * from '../methods'
export * from './contextmenu'

type Before = Partial<{
  [K in Operations]: (...args: Parameters<OperationMap[K]>) => Promise<boolean> | boolean
}>

export interface Theme {
  name: string
  palette: string[]
  cssVar: Partial<{
    '--main-color': string
    '--main-bgcolor': string
    '--color': string
    '--bgcolor': string
    '--selected': string
    '--panel-color': string
    '--panel-bgcolor': string
    '--root-color': string
    '--root-bgcolor': string
    '--root-radius': string
    '--main-radius': string
    '--topic-padding': string
    '--panel-border-color': string
  }>
}

/**
 * The MindElixir instance
 *
 * @public
 */
export interface MindElixirInstance extends MindElixirMethods {
  isFocusMode: boolean
  nodeDataBackup: NodeObj
  mindElixirBox: HTMLElement

  nodeData: NodeObj
  linkData: LinkObj
  summaries: Summary[]

  currentNode: Topic | null
  currentNodes: Topic[] | null
  currentSummary: SummarySvgGroup | null

  waitCopy: Topic | null
  currentLink: CustomSvg | null
  scaleVal: number
  tempDirection: number | null
  theme: Theme
  userTheme?: Theme
  direction: number
  locale: string
  draggable: boolean
  editable: boolean
  contextMenu: Array<ContextMenuItem | Actions>
  toolBar: boolean
  keypress: boolean
  mouseSelectionButton: 0 | 2
  before: Before
  newTopicName: string
  allowUndo: boolean
  overflowHidden: boolean
  mainLinkStyle: number
  subLinkStyle: number
  mobileMenu: boolean

  container: HTMLElement
  map: HTMLElement
  root: HTMLElement
  nodes: HTMLElement
  lines: SVGElement
  summarySvg: SVGElement
  linkController: SVGElement
  P2: HTMLElement
  P3: HTMLElement
  line1: SVGElement
  line2: SVGElement
  linkSvgGroup: SVGElement
  /**
   * @internal
   */
  helper1?: LinkDragMoveHelperInstance
  /**
   * @internal
   */
  helper2?: LinkDragMoveHelperInstance

  bus: ReturnType<typeof Bus.create<EventMap>>
  history: Operation[]
  undo: () => void
  redo: () => void

  selection: SelectionArea
}

/**
 * The MindElixir options
 *
 * @public
 */
export interface Options {
  el: string | HTMLElement
  direction?: number
  locale?: string
  draggable?: boolean
  editable?: boolean
  contextMenu?: Array<ContextMenuItem | Actions>
  toolBar?: boolean
  keypress?: boolean
  mouseSelectionButton?: 0 | 2
  before?: Before
  newTopicName?: string
  allowUndo?: boolean
  overflowHidden?: boolean
  mainLinkStyle?: number
  subLinkStyle?: number
  mobileMenu?: boolean
  theme?: Theme
  nodeMenu?: boolean
}

export type Uid = string

/**
 * MindElixir node object
 *
 * @public
 */
export interface NodeObj {
  topic: string
  id: Uid
  style?: {
    fontSize?: string
    color?: string
    background?: string
    fontWeight?: string
  }
  children?: NodeObj[]
  tags?: string[]
  icons?: string[]
  hyperLink?: string
  expanded?: boolean
  direction?: number
  isLeaf?: boolean
  isRoot?: boolean
  image?: {
    url: string
    width: number
    height: number
  }
  // main node specific properties
  branchColor?: string
  // add programatically
  parent?: NodeObj // root node has no parent
  // TODO: checkbox
  // checkbox?: boolean | undefined
}
export type NodeObjExport = Omit<NodeObj, 'parent'>

export type LinkObj = Record<string, LinkItem>

/**
 * The exported data of MindElixir
 *
 * @public
 */
export interface MindElixirData {
  nodeData: NodeObj
  linkData?: LinkObj
  summaries?: Summary[]
  direction?: number
  theme?: Theme
}
