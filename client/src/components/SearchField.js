import React from 'react'
import { Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap'

export default function SearchField(props) {
  return (
    <Form>
      <FormGroup>
        <FormLabel>Search</FormLabel>
        <FormControl type="text" value={props.filter} onChange={event => props.filterSearch(event)} placeholder="Search..." />
      </FormGroup>
    </Form>
  )
}
