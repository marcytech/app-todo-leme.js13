import { observerFactory, routerParamsFactory } from 'lemejs'

import { appTitle } from '@/components/appTitle'
import { appButton, appButtonEventEmitter } from '@/components/appButton'
import { appList, appListEventEmitter } from '@/components/appList'

import { projectServiceFactory } from 'services/projectService'
import { transformProps } from '@/utils/transform'

const template = ({ state, toProp, html }) => html`
  <div class="ctx-header">
    <div>
      <app-title data-bg="#fff">
        <h2>Tasks</h2>
      </app-title>
    </div>
    <div class="ctx-controlls">
      <app-button
        data-type="circle"
        data-style="hollow"
        data-status="danger"
        data-size="2"
        data-event-emit="remove:task"
      >
        <span class="material-symbols-rounded"> delete </span>
      </app-button>

      <app-button
        data-type="circle"
        data-style="hollow"
        data-status="success"
        data-size="2"
        data-event-emit="showFormTask"
        data-event-payload="${toProp({
          visibility: true,
          action: 'createTask'
        })}"
        ${state.action === 'editTask' && 'data-disabled="disabled"'}
      >
        <span class="material-symbols-rounded"> add </span>
      </app-button>
    </div>
  </div>

  <div class="ctx-form ${state.formVisibility && 'ctx-show-form'}">
    <textarea type="text" class="ctx-input">${state.value}</textarea>
    <div class="ctx-button">
      <app-button
        data-type="square"
        data-style="hollow"
        data-status="danger"
        data-event-emit="hideFormTask"
        data-event-payload="${toProp({ visibility: false })}"
      >
        Cancelar
      </app-button>
      <app-button
        data-type="square"
        data-style="filled"
        data-status="success"
        data-event-emit="changeTask"
      >
        Salvar
      </app-button>
    </div>
  </div>

  <app-list
    data-theme="light"
    data-list="${toProp(state.dataList)}"
    data-keys="${toProp(state.dataKeys)}"
    data-disable-links="disabled"
    data-event-emit="onEditTask"
    data-select-event="select:task:item"
    data-event-payload="${toProp({ visibility: true, action: 'editTask' })}"
    ${state.action === 'createTask' && 'data-disabled="disabled"'}
  ></app-list>
`

export const appTasks = () => {
  const projectService = projectServiceFactory()

  const state = observerFactory({
    dataKeys: ['id', 'projectId', 'description'],
    dataList: [],
    dataLinks: ['projectId'],
    value: '',
    id: null,
    formVisibility: false,
    action: ''
  })
  const children = () => ({
    appTitle,
    appButton,
    appList
  })

  const hooks = () => ({
    beforeOnInit
    // afterOnRender
  })

  const events = () => ({
    onTypeTextArea
  })

  const beforeOnInit = () => {
    getTasks()

    appButtonEventEmitter.on('remove:task', removeTasks)
    appListEventEmitter.on('select:task:item', selectTaskToRemove)

    appButtonEventEmitter.on('remove:project', getTasks)

    appButtonEventEmitter.on('onEditTask', (data) => {
      setAction(data)
      setFormTaskVisibility(data)
      setValue(data)
    })

    appButtonEventEmitter.on('changeTask', () => {
      const { value, id, action } = state.get()
      if (action === 'editTask') return updateTask(value, id)
      createTask()
    })
    appButtonEventEmitter.on('showFormTask', (data) => {
      setAction(data)
      setFormTaskVisibility(data)
    })
    appButtonEventEmitter.on('hideFormTask', (data) => {
      setFormTaskVisibility(data)
      state.set({
        ...state.get(),
        action: '',
        value: '',
        id: ''
      })
    })
  }

  const onTypeTextArea = ({ on, queryOnce }) => {
    const input = queryOnce('textarea')
    on('keyup', input, ({ event }) => {
      state.set({ ...state.get(), value: event.target.value })
    })

    input.focus()
    const valueLength = input.value.length
    input.setSelectionRange(valueLength, valueLength)
  }

  const setFormTaskVisibility = ({ payload }) => {
    const formVisibility = payload.visibility
    state.set({ ...state.get(), formVisibility })
  }

  const selectTaskToRemove = ({ id, checked }) => {
    const { dataList } = state.get()
    const data = dataList.map((task) => {
      if (task.id === id) task.checked = checked
      return task
    })
    state.set({ ...state.get(), dataList: data })
  }

  const removeTasks = async () => {
    const routerParams = routerParamsFactory()
    const projectId = routerParams.getFirst()

    const { dataList } = state.get()
    const selectedTasks = dataList.filter((task) => task.checked)
    const selectedIdis = selectedTasks.map((task) => task.id)

    await projectService.removeTasks(selectedIdis)
    const newDataList = await projectService.getTasks(projectId)
    const tasks = transformProps([['description', 'text']], newDataList)
    state.set({ ...state.get(), dataList: tasks })
  }

  const updateTask = async (description, id) => {
    const routerParams = routerParamsFactory()
    const projectId = routerParams.getFirst()
    const { dataList } = state.get()
    const task = await projectService.updateTask({ id, projectId, description })

    const [updatedTask] = transformProps([['description', 'text']], task)

    const indexTask = dataList.findIndex(
      (oldTask) => oldTask.id === updatedTask.id
    )
    dataList.splice(indexTask, 1, updatedTask)

    state.set({
      ...state.get(),
      dataList,
      action: '',
      formVisibility: false,
      value: '',
      id: ''
    })
  }

  const createTask = async () => {
    const payload = { action: '' }
    const routerParams = routerParamsFactory()
    const { value: description } = state.get()
    const projectId = routerParams.getFirst()
    await projectService.createTask({ projectId, description })
    const formTask = { payload: { visibility: false } }
    setFormTaskVisibility(formTask)
    setAction({ payload })
    getTasks()
  }
  const setValue = ({ payload }) => {
    state.set({ ...state.get(), value: payload.text, id: payload.id })
  }

  const setAction = ({ payload }) => {
    state.set({ ...state.get(), action: payload.action })
  }

  const getTasks = async () => {
    const routerParams = routerParamsFactory()
    const projectId = routerParams.getFirst()
    if (!projectId) return
    const dataList = await projectService.getTasks(projectId)
    const data = transformProps([['description', 'text']], dataList)
    state.set({ ...state.get(), dataList: data, value: '' })
  }
  return { template, styles, children, state, hooks, events }
}
const styles = ({ ctx, css }) => css`
  ${ctx} {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
    height: 100vh;
  }
  .ctx-header {
    display: grid;
    grid-template-columns: 1fr 8rem;
    width: 100%;
  }
  .ctx-controlls {
    display: flex;
    background: #fff;
    padding: 0 1rem;
  }
  .ctx-form {
    display: grid;
    grid-template-columns: 1fr 15.625rem;
    gap: 1rem;
    width: 100%;
    height: 0;
    background: #edf9fb;
    overflow: hidden;
  }
  .ctx-show-form {
    padding: 1rem;
    height: auto;
  }

  .ctx-input {
    padding: 1rem;
    outline-color: #ebebeb;
    border: 0;
    border-radius: 5px;
    font-size: 1rem;
    color: #666;
  }
  .ctx-button > app-button:first-of-type {
    margin-bottom: 1rem;
  }
`
