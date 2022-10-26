const template = ({ html }) => html`
  <div class="ctx-title">
    <slot></slot>
  </div>
`

export const appTitle = () => {
  return { template, styles }
}

const styles = ({ ctx, props, css }) => css`
  ${ctx},
  .ctx-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 3.75rem;
    background: ${props.bg ? props.bg : 'none'};
  }
  .ctx-title > h1,
  .ctx-title > h2,
  .ctx-title > h3 {
    display: flex;
    justify-content: ${props.align && props.align === 'center'
      ? 'center'
      : 'flex-start'};
    align-items: center;
    width: 100%;
    font-size: 1.4rem;
    font-weight: bold;
    color: #07c7a4;
    padding: 0 1rem;
  }
`
