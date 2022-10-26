import { appProjects } from '@/components/appProjects'
import { appError } from '../appError'

const template = ({ html }) => html`
  <app-error></app-error>
  <app-projects></app-projects>
  <router-view></router-view>
`

export const appMain = () => {
  const children = () => ({
    appProjects,
    appError
  })

  return { template, styles, children }
}

const styles = ({ ctx, css }) => css`
  ${ctx} {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100vh;
    background: #dcf5e6;
  }
`
