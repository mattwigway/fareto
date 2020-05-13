import React from 'react';
import ProfileRequestUI from './ProfileRequestUI'
import ParetoResult from './ParetoResult'
import './App.css';

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errorText: null,
      result: null,
      tripIndex: null
    }
  }

  setError = (err) => {
    this.setState({errorText: err, tripIndex: null})
  }

  setResults = (res) => {
    this.setState({result: res, tripIndex: null})
  }

  setTripIndex = (i) => this.setState({tripIndex: i})

  render () {
    return <>
      <ProfileRequestUI setError={this.setError} setResults={this.setResults} tripIndex={this.state.tripIndex} result={this.state.result} />
      {this.state.errorText && <div><span class="error-text">{this.state.errorText}</span></div>}
      {this.state.result && <ParetoResult result={this.state.result} tripIndex={this.state.tripIndex} setTripIndex={this.setTripIndex} key={Math.random()} />}
    </>
  }
}

export default App;
