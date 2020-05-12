import React from 'react'
import {secondsToTime} from './timeutil'
import Leg from './Leg'

/** Displays an itinerary */
export default class Itinerary extends React.Component {
    render () {
        return <div>
            Duration: {secondsToTime(this.props.trip.durationSeconds)}<br/>
            Fare: {this.props.trip.fare}<br/>
            Segments:<br/>
            <ul>
                {this.props.trip.legs.map((leg, idx) => <Leg key={idx} leg={leg} />)}
            </ul>
        </div>
    }
}