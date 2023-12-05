import { actionMapping } from '../const'
import i18n from '../i18n'
import type { ContextMenuItem } from '../types/contextmenu'
import { Actions } from '../types/contextmenu'
import type { Topic } from '../types/dom'
import { type MindElixirInstance } from '../types/index'
import dragMoveHelper from '../utils/dragMoveHelper'
import { encodeHTML, isActionEnum, isCtxMenuItem, isTopic } from '../utils/index'
import './contextMenu.less'

export const defaultAction = {}

const createLi = (id: string, name: string, keyname: string) => {
  const li = document.createElement('li')
  li.id = id
  li.innerHTML = `<span>${encodeHTML(name)}</span><span>${encodeHTML(keyname)}</span>`
  return li
}

const addChildEl = createLi('cm-addChild', i18n['cn'].addChild, 'tab')
const removeNodeEl = createLi('cm-removeNode', i18n['cn'].removeNode, 'delete')
type MenuItemCtx = { el: HTMLLIElement; item: ContextMenuItem }

export default function (mind: MindElixirInstance, option: Array<ContextMenuItem | Actions>) {
  const locale = i18n[mind.locale] ? mind.locale : 'cn'
  const lang = i18n[locale]
  const menuContainer = document.createElement('div')
  const menuUl = document.createElement('ul')
  menuUl.className = 'menu-list'
  const elementSet = createMenu(mind, option, lang, menuContainer)
  Object.values(elementSet).forEach(it => {
    menuUl.appendChild(it.el)
  })
  menuContainer.className = 'context-menu'
  menuContainer.appendChild(menuUl)
  menuContainer.hidden = true

  mind.container.append(menuContainer)
  mind.container.oncontextmenu = function (e) {
    e.preventDefault()
    if (!mind.editable) return
    // console.log(e.pageY, e.screenY, e.clientY)
    const target = e.target as HTMLElement
    if (isTopic(target)) {
      hideMenuItems(target, elementSet)
      if (!mind.currentNodes) mind.selectNode(target)
      menuContainer.hidden = false
      if (dragMoveHelper.mousedown) {
        dragMoveHelper.mousedown = false
      }
      menuUl.style.top = ''
      menuUl.style.bottom = ''
      menuUl.style.left = ''
      menuUl.style.right = ''
      const rect = menuUl.getBoundingClientRect()
      const height = menuUl.offsetHeight
      const width = menuUl.offsetWidth

      const relativeY = e.clientY - rect.top
      const relativeX = e.clientX - rect.left

      if (height + relativeY > window.innerHeight) {
        menuUl.style.top = ''
        menuUl.style.bottom = '0px'
      } else {
        menuUl.style.bottom = ''
        menuUl.style.top = relativeY + 15 + 'px'
      }

      if (width + relativeX > window.innerWidth) {
        menuUl.style.left = ''
        menuUl.style.right = '0px'
      } else {
        menuUl.style.right = ''
        menuUl.style.left = relativeX + 10 + 'px'
      }
    }
  }

  menuContainer.onclick = e => {
    if (e.target === menuContainer) menuContainer.hidden = true
  }
}

const hideMenuItems = (target: Topic, ctxMenuItems: Record<string, MenuItemCtx>) => {
  const node = target.nodeObj
  const isRoot = node ? node.isRoot : target.parentElement.tagName === 'ME-ROOT'
  ;(Object.values(ctxMenuItems) || []).forEach(it => {
    it.el.className = (isRoot && !it.item.showInRoot) || (node.isLeaf && !it.item.showInLeaf) ? 'disabled' : ''
  })
  return
}

const createMenu: (
  mind: MindElixirInstance,
  option: Array<ContextMenuItem | Actions>,
  lang: Record<string, string>,
  menuContainer: HTMLDivElement
) => Record<string, MenuItemCtx> = (mind, option, lang, menuContainer) => {
  const elementSet: Record<string, { el: HTMLLIElement; item: ContextMenuItem }> = {}
  const ctxMenuItems: Array<ContextMenuItem> = (option || [])
    .filter(it => isActionEnum(it) || isCtxMenuItem(it))
    .map(it => (isActionEnum(it) ? actionMapping[it as Actions] : it))
  for (const item of ctxMenuItems) {
    const el = createLi(`cm-${item.key}`, item.name || item.key, item.shortcut || '')
    el.onclick = () => {
      item.onClick(mind)
      menuContainer.hidden = true
    }
    elementSet[item.key] = { item, el }
  }
  if (Object.keys(elementSet).length === 0) {
    elementSet[Actions.ADD_CHILD] = { el: addChildEl, item: actionMapping[Actions.ADD_CHILD] }
    elementSet[Actions.REMOVE_NODE] = { el: removeNodeEl, item: actionMapping[Actions.REMOVE_NODE] }
  }
  return elementSet
}
