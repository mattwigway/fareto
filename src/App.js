import React from 'react';
import ProfileRequestUI from './ProfileRequestUI'
import ParetoResult from './ParetoResult'
import './App.css';

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errorText: null,
      result: null
    }
  }

  setError = (err) => {
    this.setState({errorText: err})
  }

  setResults = (res) => {
    this.setState({result: res})
  }

  render () {
    return <>
      <ProfileRequestUI setError={this.setError} setResults={this.setResults} />
      {this.state.errorText && <div class="error-text">this.state.errorText</div>}
      {this.state.result && <ParetoResult result={this.state.result} />}
    </>
  }
}

export default App;
