const clouds = {
  AWS: 'AWS',
  GCP: 'GCP'
}

const budgetNameSuffix = {
  EMAIL: '-budget-email',
  PUBSUB: '-budget-pubsub'
}

const creationStatuses = {
  DONE: 'Done',
  INPROGRESS: 'In progress',
  FAILED: 'Failed'
}

module.exports = {
  clouds,
  budgetNameSuffix,
  creationStatuses
}
