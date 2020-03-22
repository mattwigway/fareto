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

        // create points for the Pareto frontier itself
        let points = []

        let sortedTrips = this.props.result.trips.slice(0) // copy
        sortedTrips.sort((a, b) => a.durationSeconds - b.durationSeconds)

        if (sortedTrips.length > 0) {
            let lastx = timeScale(sortedTrips[0].durationSeconds)
            let lasty = costScale(sortedTrips[0].fare)
            points.push([lastx, lasty].join(','))

            // draw the pareto curve, but since it's not smooth, draw with 90 degree angles
            // i.e. graph should look like -| not \
            if (sortedTrips.length > 1) {
                sortedTrips.slice(1).forEach((trip) => {
                    let x = timeScale(trip.durationSeconds)
                    let y = costScale(trip.fare)

                    points.push([x, lasty].join(','))
                    points.push([x, y].join(','))
                    lastx = x
                    lasty = y
                })
            }
        }

        points = points.join(' ')

        return <svg width={1000} height={400}>
            <g>
                <g>
                    <text x={0} y={costScale(maxCost)}>{maxCost}</text>
                    <text x={0} y={200}>Cost</text>
                    <text x={960} y={timeScale(maxTime)}>{secondsToTime(maxTime)}</text>
                    <text x={475} y={390}>Time</text>
                </g>
                <g>
                    <polyline points={points} stroke="black" fill="none" />
                    {/* using unsorted here so tripIndex is correct */}
                    {this.props.result.trips.map((t, i) => <circle
                        cx={timeScale(t.durationSeconds)}
                        cy={costScale(t.fare)}
                        r={3}
                        fill={i === this.props.tripIndex ? "red" : "black"}
                        stroke={i === this.props.tripIndex ? "red" : "black"}
                        onClick={() => this.props.setTripIndex(i)} />)}
                </g>
            </g>
        </svg>
    }
}