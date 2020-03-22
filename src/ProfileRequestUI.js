import React from 'react'
import ODMap from './ODMap'

/** seconds since midnight to HH:MM */
function secondsToTime (seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/** HH:MM to seconds since midnight */
function timeToSeconds (time) {
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 3600 + parseInt(minutes) * 60
}

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
                "toTime": 32400,
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
                "monteCarloDraws": 20,
                "maxFare": 200000
            }
        }
    }

    setRequestFields = (fields) => {
        this.setState({ profileRequest: Object.assign({}, this.state.profileRequest, fields)})
    }

    setToTime = (timeHhMm) => {
        this.setRequestFields({toTime: timeToSeconds(timeHhMm)})
    }

    setFromTime = (timeHhMm) => {
        this.setRequestFields({fromTime: timeToSeconds(timeHhMm)})
    }

    setDate = (date) => {
        this.setRequestFields({date: date})
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
                            <td><label for="fromTime">From time</label></td>
                            <td><input type="time" name="fromTime" id="fromTime" value={secondsToTime(this.state.profileRequest.fromTime)} onChange={this.setFromTime} /></td>
                        </tr>
                        <tr>
                            <td><label for="toTime">To time</label></td>
                            <td><input type="time" name="toTime" id="toTime" value={secondsToTime(this.state.profileRequest.toTime)} onChange={this.setToTime} /></td>
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