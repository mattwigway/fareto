import React from 'react'
import ParetoSurface from './ParetoSurface'
import Itinerary from './Itinerary'

/** encapsulates all the result display */
export default class ParetoResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {tripIndex: null, filterNonOptimal: true}
    }

    setFilter = (e) => {
        this.setState({filterNonOptimal: e.target.checked})
    }

    render () {
        return <div class="paretoResult">
            <ParetoSurface result={this.props.result} setTripIndex={this.props.setTripIndex} tripIndex={this.props.tripIndex} filterNonOptimal={this.state.filterNonOptimal} />
            <br/>
            <input type="checkbox" checked={this.state.filterNonOptimal} onChange={this.setFilter} id="filter" />
            <label for="filter">Remove non-Pareto-optimal trips (retained due to transfer allowance)</label>
            {this.props.tripIndex !== null && <Itinerary trip={this.props.result.trips[this.props.tripIndex]} />}
            <br/>
            Computed in {this.props.result.computeTimeMillis}ms
        </div>
    }
}