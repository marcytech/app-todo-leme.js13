import { observerFactory } from 'lemejs'
import { errorMessage } from '@/utils/errorMessage'

const template = ({ state, html }) => {
  return state.visibility
    ? html` <div class="ctx-message">${state.message}</div> `
    : ''
}

export const appError = () => {
  const state = observerFactory({
    message: 'Um erro'
  })
  const hooks = () => ({
    beforeOnInit
  })
  const beforeOnInit = () => {
    errorMessage.on('project-error', showMessage)
  }

  const showMessage = (message) => {
    const visibility = true
    state.set({ message, visibility })

    setTimeout(() => {
      state.set({ visibility: false })
    }, 1000)
  }

  return { template, styles, state, hooks }
}
const styles = ({ ctx, css }) => css`
  ${ctx},
  .ctx-mesage {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ctx-message {
    width: 100%;
    height: 75px;
    background: #f27a77;
    color: #fff;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: lighter;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3000;
  }
`
