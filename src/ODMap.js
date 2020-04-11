import React from 'react'
import {Map, TileLayer, Marker, Popup, GeoJSON, CircleMarker} from 'react-leaflet'

import {startIcon, endIcon} from './icons'

export default class ODMap extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            center: [(props.coords.fromLat + props.coords.toLat) / 2, (props.coords.fromLon + props.coords.toLon) / 2],
            zoom: 12
        }

        this.fromMarker = React.createRef()
        this.toMarker = React.createRef()
    }

    setFromCoords = () => {
        if (this.fromMarker.current != null) {
            const {lat, lng} = this.fromMarker.current.leafletElement.getLatLng()
            this.props.setCoords({
                fromLat: lat,
                fromLon: lng
            })
        }
    }

    setToCoords = () => {
        if (this.toMarker.current != null) {
            const {lat, lng} = this.toMarker.current.leafletElement.getLatLng()
            this.props.setCoords({
                toLat: lat,
                toLon: lng
            })
        }
    }

    render () {
        return <Map center={this.state.center} zoom={this.state.zoom}>
            {/* stock OSM */}
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
                draggable={true}
                onDragend={this.setFromCoords}
                position={[this.props.coords.fromLat, this.props.coords.fromLon]}
                icon={startIcon}
                ref={this.fromMarker} >
                <Popup>Origin</Popup>
            </Marker>

            <Marker
                draggable={true}
                onDragend={this.setToCoords}
                position={[this.props.coords.toLat, this.props.coords.toLon]}
                icon={endIcon}
                ref={this.toMarker} >
                <Popup>Destination</Popup>
            </Marker>

            {this.props.result && this.props.result.trips && this.props.tripIndex != null && this.renderTrip(this.props.result.trips[this.props.tripIndex])}
        </Map>
    }

    renderTrip = (trip) => {
        // create geojson for leaflet
        const stops = []
        const coords = [[this.props.coords.fromLon, this.props.coords.fromLat]]
        // TODO eventually make them different colors for walk, ride
        trip.legs.forEach(l => {
            stops.push([l.boardStopLon, l.boardStopLat])
            stops.push([l.alightStopLon, l.alightStopLat])
            l.geom.coordinates.forEach(c => coords.push(c))
        })

        coords.push([this.props.coords.toLon, this.props.coords.toLat])
        
        const line = {
            type: 'Feature',
            geometry: {
                type: "LineString",
                coordinates: coords
            }
        }

        // force replace on re-render, GeoJSON does not update
        return <>
            <GeoJSON key={Math.random()} data={line} />
            {stops.map(([lon, lat]) => <CircleMarker center={[lat, lon]} radius={4} />)}
        </>
    }
}