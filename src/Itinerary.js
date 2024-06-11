import React from 'react'
import {secondsToTime} from './timeutil'
import Leg from './Leg'

/** Displays an itinerary */
export default class Itinerary extends React.Component {
    renderGeoJson () {
        const finalLegCoords = this.props.trip.legs[this.props.trip.legs.length - 1].geom.coordinates
        const json = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {
                        'type': 'access'
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [this.props.request.fromLon, this.props.request.fromLat],
                            this.props.trip.legs[0].geom.coordinates[0]
                        ]
                    }
                },
                ...this.props.trip.legs.map(this.renderLegGeoJson),
                {
                    type: 'Feature',
                    properties: {
                        'type': 'egress'
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            finalLegCoords[finalLegCoords.length - 1],
                            [this.props.request.toLon, this.props.request.toLat]
                        ]
                    }
                },
            ]
        }

        return `data:application/json;base64,${btoa(JSON.stringify(json).replace(/[^\x00-\x7f]/g,'-'))}`
    }

    renderLegGeoJson (leg, idx) {
        return {
            type: 'Feature',
            properties: {
                index: idx,
                type: leg.type,
                originStopName: leg.originStopName,
                originStopId: leg.originStopId,
                destStopId: leg.destStopId,
                destStopName: leg.destStopName,
                route_short_name: leg.type === 'transit' ? leg.route.route_short_name : undefined,
                route_long_name: leg.type === 'transit' ? leg.route.route_long_name : undefined,
                route_type: leg.type === 'transit' ? leg.route.route_type : undefined,
                cumulativeFare: leg.cumulativeFare
            },
            geometry: leg.geom
        }
    }

    render () {
        return <div>
            Duration: {secondsToTime(this.props.trip.durationSeconds)}<br/>
            Fare: {this.props.trip.fare}<br/>
            Segments:<br/>
            <ul>
                {this.props.trip.legs.map((leg, idx) => <Leg key={idx} leg={leg} />)}
            </ul>

            <a href={this.renderGeoJson()} download="fareto-trip.geojson">Download itinerary GeoJSON</a>
        </div>
    }
}