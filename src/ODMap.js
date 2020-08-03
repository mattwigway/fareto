import React from 'react'
import {Map, TileLayer, Marker, Popup, GeoJSON, CircleMarker} from 'react-leaflet'

import {startIcon, endIcon} from './icons'

export default class ODMap extends React.Component {
    constructor(props) {
        super(props)
        this.fromMarker = React.createRef()
        this.toMarker = React.createRef()
        this.state = {
            center: [(props.coords.fromLat + props.coords.toLat) / 2, (props.coords.fromLon + props.coords.toLon) / 2],
            zoom: 12
        }
    }

    componentDidUpdate (prevProps) {
        // center the map after load
        if ((this.props.coords.fromLat !== prevProps.coords.fromLat || this.props.coords.fromLon !== prevProps.coords.fromLon ||
                this.props.coords.toLat !== prevProps.coords.toLat || this.props.coords.toLon !== prevProps.coords.toLon) &&
                (this.props.result !== prevProps.result)) {
            this.setState({center: [(this.props.coords.fromLat + this.props.coords.toLat) / 2, (this.props.coords.fromLon + this.props.coords.toLon) / 2]})
        }
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
        let tileLayer
        if (process.env.REACT_APP_MAPBOX_TOKEN) {
            // Mapbox Streets
            tileLayer = <TileLayer
                url={"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=" + process.env.REACT_APP_MAPBOX_TOKEN}
                tileSize={512}
                zoomOffset={-1}
                attribution='© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
        } else {
            // Stock OSM
            tileLayer = <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
        }

        return <Map center={this.state.center} zoom={this.state.zoom}>
            {tileLayer}
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
            stops.push([l.originLon, l.originLat])
            stops.push([l.destLon, l.destLat])
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