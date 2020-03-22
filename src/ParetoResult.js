import React from 'react'
import ParetoSurface from './ParetoSurface'
import Itinerary from './Itinerary'

/** encapsulates all the result display */
export default class ParetoResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {tripIndex: null}
    }

    setTripIndex = (tripIndex) => {
        this.setState({
            tripIndex: tripIndex,
        })
    }

    render () {
        return <>
            <ParetoSurface result={this.props.result} setTripIndex={this.setTripIndex} tripIndex={this.state.tripIndex} />
            {this.state.tripIndex !== null && <Itinerary trip={this.props.result.trips[this.state.tripIndex]} />}
        </>
    }
}