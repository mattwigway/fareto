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
            {leg.type === 'transit' && this.renderTransitLeg()}
            {leg.type === 'transfer' && this.renderTransferLeg()}
            &nbsp;&nbsp;
            <a onClick={this.toggleTransferAllowance} href="#">
                {(this.state.transferAllowanceExpanded ? 'Hide' : 'Show')} transfer allowance
            </a>
            {(this.state.transferAllowanceExpanded && <pre>
                {JSON.stringify(leg.transferAllowance, null, 2).slice(2, -2) /* slice removes open/close braces */} 
            </pre>)}
        </li>
    }

    renderTransitLeg () {
        const {leg} = this.props
        return <>
            {leg.originStopName} (id: {leg.originStopId}) @ {secondsToTime(leg.originTime)} =>&nbsp;
            {leg.destStopName} (id: {leg.destStopId}) @ {secondsToTime(leg.destTime)}&nbsp;
            via route {leg.route.route_short_name && leg.route.route_short_name} {leg.route.route_long_name && leg.route.route_long_name}&nbsp;
            (cumulative fare: {leg.cumulativeFare})
        </>
    }

    renderTransferLeg () {
        const {leg} = this.props
        return <>
            Transfer from&nbsp;
            {leg.originStopName} (id: {leg.originStopId}) @ {secondsToTime(leg.originTime)} =>&nbsp;
            {leg.destStopName} (id: {leg.destStopId}) @ {secondsToTime(leg.destTime)}&nbsp;
            (cumulative fare: {leg.cumulativeFare})
        </>
    }
}