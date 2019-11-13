import React from 'react'
import {Card} from 'react-bootstrap';

export default function accountCardView(props) {
    console.log(props);
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{props.account.name}</Card.Title>
            </Card.Body>
        </Card>
    )
}
