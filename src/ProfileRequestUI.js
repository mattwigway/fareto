import React from 'react'
import ODMap from './ODMap'
import {timeToSeconds, secondsToTime} from './timeutil'

export default class ProfileRequestUI extends React.Component {
    constructor (props) {
        super(props)

        // not the best place to store all the defaults
        this.state = {
            profileRequest : {
                "fromLat": 40.768540,
                "fromLon": -73.527855,
                "toLat": 40.712302,
                "toLon": -73.623859,
                "fromTime": 25200,
                "toTime": 25260,
                "walkSpeed": 1.3888888,
                "bikeSpeed": 4.1666665,
                "bikeTrafficStress": 4,
                "carSpeed": 20,
                "streetTime": 90,
                "maxWalkTime": 20,
                "maxBikeTime": 20,
                "maxCarTime": 45,
                "minBikeTime": 10,
                "minCarTime": 10,
                "date": "2019-12-16",
                "limit": 0,
                "accessModes": "WALK",
                "egressModes": "WALK",
                "directModes": "WALK",
                "transitModes": "RAIL,BUS,FERRY",
                "suboptimalMinutes": 5,
                "maxTripDurationMinutes": 240,
                "maxRides": 4,
                "inRoutingFareCalculator": {"type": "nyc"},
                "monteCarloDraws": 1,
                "maxFare": 200000
            }
        }
    }

    setRequestFields = (fields) => {
        this.setState({ profileRequest: Object.assign({}, this.state.profileRequest, fields)})
    }

    // setToTime = (e) => {
    //     this.setRequestFields({toTime: timeToSeconds(e.target.value)})
    // }

    setFromTime = (e) => {
        this.setRequestFields({
            fromTime: timeToSeconds(e.target.value),
            toTime: timeToSeconds(e.target.value) + 60
        })
    }

    setDate = (e) => {
        this.setRequestFields({date: e.target.value})
    }

    setFareCalculatorType = (fareCalculatorType) => {
        this.setRequestFields({
            inRoutingFareCalculator: Object.assign({}, this.state.inRoutingFareCalculator, {type: fareCalculatorType})
        })
    }

    handleSubmit = (e) => {
        e.preventDefault() // prevent reload
        fetch('http://localhost:8080/pareto', { // TODO hardcoded URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.profileRequest)
        })
        .then(res => res.json())
        .then(json => {
            this.props.setError(null)
            this.props.setResults(json)
        })
        .catch(console.log)
    }

    render () {
        return <>
            <form onSubmit={this.handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td><label for="fareCalculatorType">Fare calculator type</label></td>
                            <td><input type="text" name="fareCalculatorType" id="fareCalculatorType" value={this.state.profileRequest.inRoutingFareCalculator.type} onChange={this.setFareCalculatorType} /></td>
                        </tr>
                        <tr>
                            <td><label for="date">Date</label></td>
                            <td><input type="date" name="date" id="date" value={this.state.profileRequest.date} onChange={this.setDate} /></td>
                        </tr>
                        <tr>
                            <td><label for="fromTime">Time</label></td>
                            <td><input type="time" name="fromTime" id="fromTime" value={secondsToTime(this.state.profileRequest.fromTime)} onChange={this.setFromTime} /></td>
                        </tr>
                        <tr>
                            <td colspan={2}><input type="submit" value="Route" /></td>
                        </tr>
                    </tbody>
                </table>
            </form>

            <ODMap setCoords={this.setRequestFields} coords={this.state.profileRequest} />
        </>
    }
}