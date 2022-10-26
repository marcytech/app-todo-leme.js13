import { createApp } from 'lemejs'
import { router } from './routes'
import { appMain } from '@/components/appMain'

const selector = '#app'

const app = createApp(selector, appMain, router)

app.init()
