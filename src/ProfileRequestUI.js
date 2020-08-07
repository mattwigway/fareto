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
                "transitModes": "TRAM,SUBWAY,RAIL,BUS,FERRY,CABLE_CAR,GONDOLA,FUNICULAR",
                "suboptimalMinutes": 5,
                "maxTripDurationMinutes": 120,
                "maxRides": 4,
                "inRoutingFareCalculator": {"type": "nyc"},
                "monteCarloDraws": 1,
                "maxFare": 200000
            },
            customProfileRequestJson: '{\n\n}',
            // defaults will be overwritten by ?load= JSON or router metadata, just put something here so map can load
            "mapCenter": [33.41945, -111.93721],
            "mapZoom": 12,
            "loadCount": 0 // increment whenever data is loaded to force a redraw of the uncontrolled inputs
        }
    }

    // hacky way to handle history/deep linking but it works
    componentDidMount () {
        // when serving static sites, don't try to fetch metadata
        let shouldSetExtentFromMetadata = true
        let shouldSetFromToFromMetadata = true
        if (window.location.search) {
            const params = new URLSearchParams(window.location.search)
            const load = params.get('load')
            if (load !== undefined) {
                // Load a pre-rendered route, saved as JSON on the server
                // for safety, make sure there are no slashes, etc. in the url
                // in case this is ever deployed on an authenticated site, someone might be able to do something
                // nasty by forcing requests to their domain with a malicious URL (I don't think they could, but maybe)
                if (/^[a-zA-Z0-9\-_]+$/.test(load)) {
                    shouldSetExtentFromMetadata = false
                    shouldSetFromToFromMetadata = false
                    fetch(`results/${load}.json`)
                    .then(async (res) => {
                        if (res.ok) {
                            const json = await res.json()
                            this.props.setError(null)
                            this.props.setResults(json)

                            // need also to update parameters
                            this.setRequestFields({
                                fromLat: json.request.fromLat,
                                fromLon: json.request.fromLon,
                                toLat: json.request.toLat,
                                toLon: json.request.toLon,
                                inRoutingFareCalculator: { type: json.request.inRoutingFareCalculator.type },
                                fromTime: json.request.fromTime,
                                toTime: json.request.toTime + 60,
                                date: json.request.date
                            })

                            this.setState({
                                'mapCenter': [
                                    (json.request.fromLat + json.request.toLat) / 2,
                                    (json.request.fromLon + json.request.toLon) / 2
                                ],
                                'mapZoom': 12, // TODO set zoom based on extents
                                'loadCount': this.state.loadCount + 1
                            })

                            // allow deep linking to specific result
                            const index = params.get('index')
                            if (index !== undefined && /^[0-9]+/.test(index)) {
                                this.props.setTripIndex(parseInt(index))
                            }
                        } else {
                            this.props.setError(await res.text())
                            this.props.setResults(null)
                        }
                    })

                } else {
                    this.props.setError('Invalid character in result name!')
                }
            }
        } else if (window.location.hash) {
            const hashState = JSON.parse(decodeURIComponent(window.location.hash.slice(1)))

            // enforce formatting of strings
            if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(hashState.date)) {
                this.props.setError('invalid date format, should be YYYY-MM-DD')
            } else if (!/^[a-zA-Z0-9\-]+$/.test(hashState.fareCalculatorType)) {
                this.props.setError('invalid fare calculator type') 
            } else {
                // Make a new request
                this.setRequestFields({
                    fromLat: Number(hashState.fromLat),
                    fromLon: Number(hashState.fromLon),
                    toLat: Number(hashState.toLat),
                    toLon: Number(hashState.toLon),
                    inRoutingFareCalculator: { type: hashState.fareCalculatorType },
                    fromTime: Number(hashState.time),
                    toTime: Number(hashState.time + 60),
                    date: hashState.date
                })
                shouldSetFromToFromMetadata = false
            }
        }

        if (shouldSetExtentFromMetadata || shouldSetFromToFromMetadata) {
            fetch('/metadata')
            .then(async (res) => {
                if (res.ok) {
                    const meta = await res.json()
                    const centerLat = (meta.envelope.maxY + meta.envelope.minY) / 2
                    const centerLon = (meta.envelope.maxX + meta.envelope.minX) / 2
                    if (shouldSetExtentFromMetadata) {
                        this.setState({
                            "mapCenter": [
                                centerLat,
                                centerLon
                            ],
                            "zoom": 12
                        })
                    }

                    if (shouldSetFromToFromMetadata) {
                        this.setRequestFields({
                            fromLat: centerLat + 0.01, // ~1km at equator/sea level
                            toLat: centerLat - 0.01,
                            fromLon: centerLon + 0.01,
                            toLon: centerLon - 0.01
                        })
                    }
                } else {
                    this.props.setError(await res.text())
                }
            })
        }

        this.setState({'loadCount': this.state.loadCount + 1})
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

    setFareCalculatorType = (e) => {
        this.setRequestFields({
            inRoutingFareCalculator: Object.assign({}, this.state.profileRequest.inRoutingFareCalculator, {type: e.target.value})
        })
    }

    setCustomProfileRequestJson = (e) => {
        this.setState({
            customProfileRequestJson: e.target.value
        })
    }

    reverseOd = (e) => {
        this.setRequestFields({
            'fromLat': this.state.profileRequest.toLat,
            'fromLon': this.state.profileRequest.toLon,
            'toLat': this.state.profileRequest.fromLat,
            'toLon': this.state.profileRequest.fromLon
        })
    }

    handleSubmit = (e) => {
        e.preventDefault() // prevent reload

        // update hash only on submit
        // hacky way to handle hash
        // TODO persist map state
        const hashState = {
            fromLat: this.state.profileRequest.fromLat,
            fromLon: this.state.profileRequest.fromLon,
            toLat: this.state.profileRequest.toLat,
            toLon: this.state.profileRequest.toLon,
            fareCalculatorType: this.state.profileRequest.inRoutingFareCalculator.type,
            time: this.state.profileRequest.fromTime,
            date: this.state.profileRequest.date,
            customProfileRequestJson: this.state.customProfileRequestJson
        }

        window.location.hash = '#' + encodeURIComponent(JSON.stringify(hashState))

        let custom
        try {
            custom = JSON.parse(this.state.customProfileRequestJson)
        } catch (err) {
            alert(`Error parsing custom JSON: ${err}`)
        }

        fetch('/pareto', { // TODO hardcoded URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.assign({}, this.state.profileRequest, custom))
        })
        .then(async (res) => {
            if (res.ok) {
                const json = await res.json()
                this.props.setError(null)
                this.props.setResults(json)
            } else {
                this.props.setError(await res.text())
                this.props.setResults(null)
            }
        })
    }

    render () {
        return <div class="paretoControls">
            <ODMap setCoords={this.setRequestFields} coords={this.state.profileRequest} result={this.props.result} tripIndex={this.props.tripIndex}
                center={this.state.mapCenter} zoom={this.state.mapZoom} />

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
                            {/*
                                an uncontrolled component is needed here so that you can type a multi-digit time without the state updates overwriting the first
                                digit, see https://github.com/conveyal/fareto/issues/3. However, this also means that an update from reading a URL or loading a
                                static result won't cause the time field to update. By adding the loadCount as a key, the field is forced to redraw when a location
                                is loaded from the hash or a static site.
                            */}
                            <td><input type="time" name="fromTime" id="fromTime" defaultValue={secondsToTime(this.state.profileRequest.fromTime)}
                                onChange={this.setFromTime} key={this.state.loadCount} /></td>
                        </tr>
                        <tr>
                            <td><label for="customJson">Custom profile request JSON</label></td>
                            <td><textarea id="customJson" name="customJson" onChange={this.setCustomProfileRequestJson} value={this.state.customProfileRequestJson} /></td>
                        </tr>
                        <tr>
                            <td colspan={2}><button onClick={this.reverseOd}>Reverse origin/destination</button></td>
                        </tr>
                        <tr>
                            <td colspan={2}><input type="submit" value="Route" /></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    }
}