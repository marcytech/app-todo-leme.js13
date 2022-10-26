import { observerFactory } from 'lemejs'

import { projectServiceFactory } from 'services/projectService'
import { transformProps } from '@/utils/transform'

import { appButton, appButtonEventEmitter } from '@/components/appButton'
import { appTitle } from '@/components/appTitle'
import { appList, appListEventEmitter } from '@/components/appList'

const template = ({ html, toProp, state }) => html`
  <app-title data-align="center" data-bg="#fff">
    <h1>Projetos</h1>
  </app-title>

  ${state.isVisible &&
  html`
    <div class="ctx-form">
      <input
        id="project-title"
        type="text"
        placeholder="informe o título"
        class="ctx-input"
        value="${state.value}"
      />
      <app-button
        data-type="square"
        data-style="filled"
        data-status="success"
        data-disabled="${state.isDisabled}"
        data-event-emit="create-project"
      >
        Salvar
      </app-button>
    </div>
  `}

  <app-list
    data-list="${toProp(state.dataList)}"
    data-links="${toProp(state.dataLinks)}"
    data-event-emit="onEditProject"
    data-event-payload="${toProp({ action: 'editProject' })}"
    data-select-event="select:project:item"
  ></app-list>

  <div class="ctx-button">
    <app-button
      data-type="square"
      data-style="filled"
      data-status="success"
      data-event-emit="show-form-project"
      data-event-payload="${toProp({ action: 'createProject' })}"
      ${state.action === 'editProject' && 'data-disabled="disabled"'}
      ${state.action === 'createProject' && 'data-disabled="disabled"'}
    >
      Novo Projeto
    </app-button>

    <app-button
      data-type="square"
      data-style="hollow"
      data-status="danger"
      data-event-emit="remove:project"
    >
      Remover Projetos
    </app-button>
  </div>
`
export const appProjects = () => {
  const projectService = projectServiceFactory()
  const state = observerFactory({
    isVisible: false,
    value: '',
    isDisabled: 'disabled',
    dataList: [],
    dataLinks: ['id'],
    action: ''
  })

  const hooks = () => ({
    beforeOnInit
  })

  const children = () => ({
    appTitle,
    appButton,
    appList
  })

  const events = () => ({
    onTypeProject
  })

  const beforeOnInit = () => {
    getProjects()

    appListEventEmitter.on('select:project:item', selectProjectToRemove)

    appButtonEventEmitter.on('remove:project', removeProject)

    appButtonEventEmitter.on('onEditProject', (data) => {
      showForm()
      setFormValue(data)
    })

    appButtonEventEmitter.on('show-form-project', (data) => {
      showForm()
      setAction(data)
    })

    appButtonEventEmitter.on('create-project', () => {
      const { action } = state.get()
      if (action === 'createProject') return createProject()
      updateProject()
    })
  }

  const onTypeProject = ({ on, queryOnce }) => {
    const input = queryOnce('#project-title')
    if (!input) return
    on('keyup', input, ({ element }) => {
      const isDisabled = element.value.length >= 1 ? '' : 'disabled'
      state.set({ ...state.get(), value: element.value, isDisabled })
    })

    input.focus()
    const valueLength = input.value.length
    input.setSelectionRange(valueLength, valueLength)
  }

  const selectProjectToRemove = ({ id, checked }) => {
    const { dataList } = state.get()
    const data = dataList.map((project) => {
      if (project.id === id) project.checked = checked
      return project
    })
    state.set({ ...state.get(), dataList: data })
  }

  const removeProject = async () => {
    const { dataList } = state.get()
    const selectedProjects = dataList.filter((project) => project.checked)
    const selectedIdis = selectedProjects.map((project) => project.id)
    await projectService.removeProjects(selectedIdis)
    const newDataList = await projectService.getProjects()
    const projects = transformProps([['title', 'text']], newDataList)
    state.set({ ...state.get(), dataList: projects })
  }

  const updateProject = async () => {
    const { id, value, dataList } = state.get()
    const project = await projectService.updateProject(value, id)

    const [updateProject] = transformProps([['title', 'text']], project)

    const indexProject = dataList.findIndex(
      (oldProject) => oldProject.id === updateProject.id
    )
    dataList.splice(indexProject, 1, updateProject)
    console.log(dataList)
    state.set({
      ...state.get(),
      dataList,
      action: '',
      isVisible: false,
      value: ''
    })
  }

  const setAction = ({ payload }) => {
    state.set({ action: payload.action })
  }

  const setFormValue = ({ payload }) => {
    const isDisabled = payload?.text?.length >= 1 ? '' : 'disabled'
    const { action } = payload
    state.set({
      ...state.get(),
      value: payload.text,
      id: payload.id,
      isDisabled,
      action
    })
    console.log(state.get())
  }

  const showForm = () => {
    const isVisible = true

    state.set({
      ...state.get(),
      isVisible
    })
  }

  const hideForm = () => {
    const isVisible = true

    state.set({
      ...state.get(),
      value: '',
      isVisible
    })
  }

  const createProject = async () => {
    const { value, dataList } = state.get()
    const newProject = await projectService.createProject(value)
    const data = [...dataList, newProject]
    state.set({
      ...state.get(),
      dataList: transformProps([['title', 'text']], data),
      action: '',
      isDisabled: 'disabled'
    })
    hideForm()
  }

  const getProjects = async () => {
    const dataList = await projectService.getProjects()
    if (!dataList.length) return
    const [firstProject] = dataList
    const data = transformProps([['title', 'text']], dataList)
    state.set({ ...state.get(), dataList: data })
    window.location.hash = `#/${firstProject.id}`
  }

  return { template, styles, children, state, hooks, events }
}
const styles = ({ ctx, css }) => css`
  ${ctx} {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    max-width: 15.625rem;
    height: 100vh;
    background: #fff;
    border-right: 1px #07d1ad solid;
    position: relative;
  }
  .ctx-button {
    display: block;
    position: absolute;
    bottom: 1rem;
    margin: 0 1rem;
    width: calc(100% - 2rem);
  }
  .ctx-button > app-button + app-button {
    margin-top: 1rem;
  }

  .ctx-form {
    flex-wrap: wrap;
    padding: 1rem;
    background: #edf9fb;
  }

  .ctx-form,
  .ctx-input {
    display: flex;
    width: 100%;
  }

  .ctx-input {
    padding: 1rem;
    border: 0;
    font-size: 1rem;
    color: #666;
    background: #f1f1f1;
    margin-bottom: 1rem;
    outline-color: #ebebeb;
  }
`
