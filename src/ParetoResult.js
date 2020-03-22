import React from 'react'
import ParetoSurface from './ParetoSurface'
import Itinerary from './Itinerary'

/** encapsulates all the result display */
export default class ParetoResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    setTrip = (trip) => {
        this.setState({trip: trip})
    }

    render () {
        return <>
            <ParetoSurface result={this.props.result} setTrip={this.setTrip} />
            {this.state.trip && <Itinerary trip={this.state.trip} />}
        </>
    }
}