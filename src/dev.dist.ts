import type { Options } from '@lnks/mind-elixir'
import MindElixir, { Actions } from '@lnks/mind-elixir'
import example from '@lnks/mind-elixir/example'

const E = MindElixir.E
const options: Options = {
  el: '#map',
  newTopicName: '子节点',
  // direction: MindElixir.LEFT,
  direction: MindElixir.RIGHT,
  // data: MindElixir.new('new topic'),
  locale: 'en',
  draggable: true,
  editable: true,
  contextMenu: [Actions.ADD_CHILD, Actions.REMOVE_NODE],
  toolBar: true,
  nodeMenu: true,
  keypress: true,
  allowUndo: false,
  before: {
    moveDownNode() {
      return false
    },
    insertSibling(el, obj) {
      console.log('insertSibling', el, obj)
      return true
    },
    async addChild(el, obj) {
      await sleep()
      return true
    },
  },
  // mainLinkStyle: 2,
}
const mind = new MindElixir(options)
mind.init(example)
function sleep() {
  return new Promise<void>(res => {
    setTimeout(() => res(), 1000)
  })
}
console.log('test E function', E('bd4313fbac40284b'))
// let mind2 = new MindElixir({
//   el: '#map2',
//   direction: 2,
//   data: MindElixir.example2,
//   draggable: false,
//   // overflowHidden: true,
//   nodeMenu: true,
// })
// mind2.init()

mind.bus.addListener('operation', operation => {
  console.log(operation)
})
mind.bus.addListener('selectNode', node => {
  console.log(node)
})
