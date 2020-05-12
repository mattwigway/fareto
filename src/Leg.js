/**
 * Represents a leg of a journey
*/

import React, {Component} from 'react'
import {secondsToTime} from './timeutil'

export default class Leg extends Component {
    constructor (props) {
        super(props)
        this.state = {
            'transferAllowanceExpanded': false
        }
    }

    toggleTransferAllowance = (e) => {
        e.preventDefault()
        this.setState({'transferAllowanceExpanded': !this.state.transferAllowanceExpanded})
    }

    render () {
        const {leg} = this.props
        return <li>
            {leg.boardStopName} (id: {leg.boardStopId}) @ {secondsToTime(leg.boardTime)} =>
            {leg.alightStopName} (id: {leg.alightStopId}) @ {secondsToTime(leg.alightTime)}
            via route {leg.route.route_short_name && leg.route.route_short_name} {leg.route.route_long_name && leg.route.route_long_name}
            (cumulative fare: {leg.cumulativeFare})&nbsp;&nbsp;
            <a onClick={this.toggleTransferAllowance} href="#">
                {(this.state.transferAllowanceExpanded ? 'Hide' : 'Show')} transfer allowance
            </a>
            {(this.state.transferAllowanceExpanded && <pre>
                {JSON.stringify(leg.transferAllowance, null, 2).slice(2, -2) /* slice removes open/close braces */} 
            </pre>)}
        </li>
    }
}