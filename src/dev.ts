import example from './exampleData/1'
import type { MindElixirCtor, Topic } from './index'
import MindElixir from './index'
import { Actions } from './types/contextmenu'
import type { MindElixirInstance, Options } from './types/index'
import type { Operation } from './utils/pubsub'

interface Window {
  m: MindElixirInstance
  M: MindElixirCtor
  E: typeof MindElixir.E
  downloadPng: typeof downloadPng
}

declare let window: Window

const E = MindElixir.E
const options: Options = {
  el: '#map',
  newTopicName: '子节点',
  direction: MindElixir.SIDE,
  // direction: MindElixir.RIGHT,
  locale: 'en',
  draggable: true,
  editable: true,
  contextMenu: [
    Actions.ADD_CHILD,
    Actions.REMOVE_NODE,
    Actions.ADD_SIBLING,
    {
      key: 'addLeaf',
      name: '添加叶子节点',
      onClick: mind => {
        mind.addChild(mind.currentNode as Topic, {
          topic: 'Add Leaf',
          id: `${Math.random()}`,
          isLeaf: true,
          tags: ['leaf'],
        })
      },
    },
  ],
  mobileMenu: true,
  toolBar: true,
  nodeMenu: true,
  keypress: true,
  allowUndo: true,
  before: {
    moveDownNode() {
      return false
    },
    insertSibling(el, obj) {
      console.log('insertSibling', el, obj)
      return true
    },
    async addChild(el, obj) {
      console.log('addChild', el, obj)
      // await sleep()
      return true
    },
  },
  mainLinkStyle: 1,
  subLinkStyle: 1,
}

const mind = new MindElixir(options)

const data = MindElixir.new('new topic')
mind.init(example)

const m2 = new MindElixir({
  el: '#map2',
})
m2.init(data)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sleep() {
  return new Promise<void>(res => {
    setTimeout(() => res(), 1000)
  })
}
console.log('test E function', E('bd4313fbac40284b'))

mind.bus.addListener('operation', (operation: Operation) => {
  console.log(operation)
  // return {
  //   name: action name,
  //   obj: target object
  // }

  // name: [insertSibling|addChild|removeNode|beginEdit|finishEdit]
  // obj: target

  // name: moveNode
  // obj: {from:target1,to:target2}
})
mind.bus.addListener('selectNode', node => {
  console.log(node)
})
mind.bus.addListener('expandNode', node => {
  console.log('expandNode: ', node)
})

const downloadPng = async () => {
  const blob = await mind.exportPng()
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'filename.png'
  a.click()
  URL.revokeObjectURL(url)
}

window.downloadPng = downloadPng
window.m = mind
// window.m2 = mind2
window.M = MindElixir
window.E = MindElixir.E
