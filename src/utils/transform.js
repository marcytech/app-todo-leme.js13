export const transformProps = (props, data) => {
  return props.flatMap((prop) => {
    const [propName, propAlias] = prop
    const dataJson = JSON.stringify(data)
    if (!propName || !propAlias) return data
    const regex = new RegExp(`"${propName}":`, 'g')
    const newDataJson = dataJson.replace(regex, `"${propAlias}":`)

    return JSON.parse(newDataJson)
  })
}
