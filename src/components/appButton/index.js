import { observerFactory, pubsubFactory } from 'lemejs'

const template = ({ html, state, props }) => html`
  <button class="button ${state.cssClasses}" ${props.disabled}>
    <slot></slot>
  </button>
`
export const appButtonEventEmitter = pubsubFactory()
export const buttonSubject = observerFactory(null)

export const appButton = ({ props, toObject }) => {
  const state = observerFactory({
    cssClasses: ''
  })

  const hooks = () => ({
    beforeOnInit
  })

  const events = () => ({
    onClickButton
  })

  const beforeOnInit = () => {
    const keys = Object.keys(props)
    const css = []
    keys.forEach((key) => {
      if (validate(key)) {
        css.push(`${key}-${props[key]}`)
      }
    })

    state.set({ cssClasses: css.join(' ') })
  }

  const validate = (key) => {
    return ['type', 'style', 'status'].includes(key)
  }

  const onClickButton = ({ on, queryOnce }) => {
    const button = queryOnce('button')
    on('click', button, ({ element }) => {
      if (!props.eventEmit) return

      appButtonEventEmitter.emit(props.eventEmit, {
        target: element,
        payload: toObject(props.eventPayload),
        eventName: props.eventEmit
      })
    })
  }

  return {
    template,
    styles,
    state,
    hooks,
    events
  }
}

const styles = ({ ctx, css }) => css`
  ${ctx},
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .button {
    color: #666;
    background: #ccc;
  }

  .button.type-circle {
    width: 3.125rem;
    height: 3.125rem;
    border-radius: 100%;
    font-weight: bold;
  }
  .button.type-square {
    height: 3.125rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
  }
  .button.type-icon {
    width: 2rem;
    height: 2rem;
    background: none;
  }

  .button.style-filled {
    color: #fff;
  }
  .button.style-hollow {
    border: 2px #0bc08a solid;
    color: #0bc08a;
    background: #fff;
  }

  .style-filled.status-success {
    background: #0bc08a;
  }
  .style-filled.status-danger {
    background: #f27a77;
  }

  .style-hollow.status-success {
    border-color: #0bc08a;
    color: #0bc08a;
  }
  .style-hollow.status-danger {
    border-color: #f27a77;
    color: #f27a77;
  }

  .type-icon.status-success {
    border-color: #0bc08a;
    color: #0bc08a;
  }
  .type-icon.status-danger {
    border-color: #f27a77;
    color: #f27a77;
  }
  .button.size-2 {
    width: 2rem;
    height: 2rem;
  }
  .button.size-3 {
    width: 3rem;
    height: 3rem;
  }
  .button.size-4 {
    width: 4rem;
    height: 4rem;
  }
  .button[disabled] {
    background: #ccc;
    cursor: not-allowed;
  }
`
