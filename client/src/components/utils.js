export const getColumnWidth = (rows, accessor, headerText) => {
  const maxWidth = 400
  const magicSpacing = 10
  const cellLength = Math.max(
    ...rows.map(row => (`${row[accessor]}` || '').length),
    headerText.length,
  )
  return Math.min(maxWidth, cellLength * magicSpacing)
}

export const budgetNameSuffix = {
  EMAIL: '-budget-email',
  PUBSUB: '-budget-pubsub'
}

export const creationStatuses = {
  DONE: 'Done',
  INPROGRESS: 'In progress',
  FAILED: 'Failed'
}
