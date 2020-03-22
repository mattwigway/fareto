import React from 'react'
import {secondsToTime} from './timeutil'

/** Displays an itinerary */
export default class Itinerary extends React.Component {
    render () {
        return <div>
            Duration: {secondsToTime(this.props.trip.durationSeconds)}<br/>
            Fare: {this.props.trip.fare}<br/>
            Segments:<br/>
            <ul>
                {this.props.trip.legs.map(leg => <li>{leg.boardStop} => {leg.alightStop} via {leg.route.route_short_name && leg.route.route_short_name} {leg.route.route_long_name && leg.route.route_long_name}</li>)}
            </ul>
        </div>
    }
}