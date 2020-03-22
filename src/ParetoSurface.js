import React from 'react'
import {secondsToTime} from './timeutil'

/** The actual Pareto curve itself */
export default class ParetoSurface extends React.Component {
    render () {
        // SCALING
        let maxCost = 0
        let maxTime = 0

        this.props.result.trips.forEach(trip => {
            maxCost = Math.max(maxCost, trip.fare)
            maxTime = Math.max(maxTime, trip.durationSeconds)
        })

        const costScale = (cost) => 400 - (10 + cost / maxCost * 380)
        const timeScale = (time) => 10 + time / maxTime * 980

        return <svg width={1000} height={400}>
            <g>
                <g>
                    <text x={0} y={costScale(maxCost)}>{maxCost}</text>
                    <text x={0} y={200}>Cost</text>
                    <text x={960} y={timeScale(maxTime)}>{secondsToTime(maxTime)}</text>
                    <text x={475} y={390}>Time</text>
                </g>
                <g>
                    {this.props.result.trips.map(t => <circle cx={timeScale(t.durationSeconds)} cy={costScale(t.fare)} r={3} stroke="black" onClick={() => this.props.setTrip(t)} />)}
                </g>
            </g>
        </svg>
    }
}