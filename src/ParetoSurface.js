import React from 'react'
import {secondsToTime} from './timeutil'

/** The actual Pareto curve itself */
export default class ParetoSurface extends React.Component {
    render () {
        // SCALING
        let maxCost = 0
        let maxTime = 0

        // sort by time
        let sortedTrips = this.props.result.trips.slice(0) // copy
        sortedTrips.forEach((t, i) => t.tripIndex = i) // okay since it's a copy
        sortedTrips.sort((a, b) => a.durationSeconds - b.durationSeconds)

        let minCostSoFar = Infinity

        sortedTrips.forEach(t => {
            t.optimal = t.fare <= minCostSoFar // since it's sorted, prev. trips guaranteed to be faster. Unless this is lower cost, it's not optimal.
            minCostSoFar = Math.min(minCostSoFar, t.fare)
        })

        if (this.props.filterNonOptimal) {
            // The algorithm can return some non-pareto-optimal trips (because of transfer allowances to future services not taken).
            // Since this is a debug tool, it is sometimes helpful to show these, but usually not. Filtern them out unless user unchecks
            // "filter trips" box.
            sortedTrips = sortedTrips.filter(t => t.optimal)
        }

        sortedTrips.forEach(trip => {
            maxCost = Math.max(maxCost, trip.fare)
            maxTime = Math.max(maxTime, trip.durationSeconds)
        })

        const costScale = (cost) => 400 - (20 + cost / maxCost * 360)
        const timeScale = (time) => 20 + time / maxTime * 940

        // create points for the Pareto frontier itself
        let points = []

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

        const timeLabels = []
        const costLabels = []

        for (let i = 0; i <= 5; i++) {
            timeLabels.push(Math.floor(maxTime / 5 * i))
            costLabels.push(Math.floor(maxCost / 5 * i))
        }

        return <svg width={1000} height={400}>
            <g>
                <g>
                    {costLabels.map(c => <text x={0} key={c} y={costScale(c)}>{c}</text>)}
                    <text key="cost" x={0} y={200}>Cost</text>
                    {timeLabels.map(t => <text key={t} x={timeScale(t)} y={375}>{secondsToTime(t)}</text>)}
                    <text key="time" x={475} y={390}>Time</text>
                </g>
                <g style={{stroke: 'lightgrey'}}>
                    {costLabels.map(c => <line key={`cost-grid-${c}`} x1={timeScale(0)} x2={timeScale(maxTime)} y1={costScale(c)} y2={costScale(c)} />)}
                    {timeLabels.map(t => <line key={`time-grid-${t}`} x1={timeScale(t)} x2={timeScale(t)} y1={costScale(0)} y2={costScale(maxCost)} />)}
                </g>
                <g style={{stroke: 'gray', fontSize: '8pt', textAnchor: 'middle'}}>
                    {sortedTrips.map(t => <text x={timeScale(t.durationSeconds)} y={costScale(t.fare) + 10}>
                        {t.legs.map(l => l.route.route_short_name != null ? l.route.route_short_name : l.route.route_long_name).join(',')}
                        </text>)}
                </g>
                <g>
                    <polyline points={points} stroke="black" fill="none" />
                    {/* using unsorted here so tripIndex is correct */}
                    {sortedTrips.map(t => <circle
                        cx={timeScale(t.durationSeconds)}
                        cy={costScale(t.fare)}
                        r={3}
                        fill={t.tripIndex === this.props.tripIndex ? "red" : "black"}
                        stroke={t.tripIndex === this.props.tripIndex ? "red" : "black"}
                        onClick={() => this.props.setTripIndex(t.tripIndex)} />)}
                </g>
            </g>
        </svg>
    }
}