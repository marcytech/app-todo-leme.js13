import { appButton } from '@/components/appButton'
import { observerFactory, pubsubFactory } from 'lemejs'

const makeLink = (dataItem, dataLinks) => {
  return dataLinks
    .map((propLink) => {
      return `${dataItem[[propLink]]}`
    })
    .join('/')
}

const template = ({ state, toProp, toObject, props, html }) => {
  return html`
    <ul class="ctx-list ${props.theme ? `ctx-${props.theme}` : ''}">
      ${state.dataList
        .map(
          (dataItem) => html`
            <li class="ctx-item">
              <input
                type="checkbox"
                class="ctx-input"
                data-id="${dataItem.id}"
                value="${dataItem.id}"
                ${dataItem.checked && 'checked'}
              />

              <a
                href="${props.disableLinks
                  ? 'javascript:void(0'
                  : `#/${makeLink(dataItem, state.dataLinks)}`}"
                class="ctx-link"
                >${dataItem.text}</a
              >
              <app-button
                data-type="icon"
                data-status="success"
                data-event-emit="${props.eventEmit}"
                data-event-payload="${toProp({
                  ...dataItem,
                  ...toObject(props.eventPayload)
                })}"
                ${props?.disabled === 'disabled' && 'data-disabled="disabled"'}
              >
                <span class="material-symbols-rounded"> edit_square </span>
              </app-button>
            </li>
          `
        )
        .join('')}
    </ul>
  `
}
export const appListEventEmitter = pubsubFactory()

export const appList = ({ props, toObject }) => {
  const state = observerFactory({
    dataList: [],
    dataLinks: [],
    eventToDispatch: 'onEditProject'
  })

  const hooks = () => ({
    afterOnInit
  })

  const children = () => ({
    appButton
  })

  const afterOnInit = () => {
    if (!props.list) return
    state.set({
      dataList: toObject(props.list),
      dataLinks: props.links ? toObject(props.links) : []
    })
  }
  const events = () => ({
    onSelect
  })

  const onSelect = ({ on, queryAll }) => {
    const inputs = queryAll('input')
    on('change', inputs, ({ element }) => {
      const { value, checked } = element
      appListEventEmitter.emit(props.selectEvent, {
        id: parseInt(value),
        checked
      })
    })
  }

  return { template, styles, children, state, hooks, events }
}

const styles = ({ ctx, css }) => css`
  ${ctx} {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
  }

  .ctx-list {
    flex-wrap: wrap;
  }
  .ctx-list.ctx-light {
    background: #fff;
    width: calc(100% - 2rem);
    margin: 1rem auto 0 auto;
    border-radius: 5px;
  }

  .ctx-list,
  .ctx-link {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
  }

  .ctx-item {
    display: grid;
    grid-template-columns: 1rem 1fr 2rem;
    border-bottom: 1px #ebebeb solid;
    padding: 0.5rem 1rem;
    width: 100%;
  }
  .ctx-link {
    justify-content: flex-start;
    align-items: center;
    padding: 0 1rem;
    color: #666;
  }
  .ctx-link.ctx-active {
    color: #07c7a4;
  }
  .ctx-input {
    width: 1rem;
  }
`
