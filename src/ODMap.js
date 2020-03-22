import React from 'react'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet'

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
                ref={this.fromMarker} >
                <Popup>Origin</Popup>
            </Marker>

            <Marker
                draggable={true}
                onDragend={this.setToCoords}
                position={[this.props.coords.toLat, this.props.coords.toLon]}
                ref={this.toMarker} >
                <Popup>Destination</Popup>
            </Marker>
        </Map>
    }
}