import { routerFactory } from 'lemejs'
import { appTasks } from '@/components/appTasks'
import { appNotFound } from '@/components/appNotFound'

const router = routerFactory()

router.add({
  hash: '/',
  validator: /^#\/\$/,
  component: appTasks,
  isInitial: true
})
router.add({
  hash: '/',
  validator: /^#\/\d{1,}$/,
  component: appTasks,
  isInitial: true
})

router.add({
  hash: 'not-found',
  validator: /^#\/not-found$/,
  component: appNotFound,
  isDefault: true
})

export { router }
