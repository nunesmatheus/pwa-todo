import React, { Component } from 'react';
import Icon from '@mdi/react'
import { mdiLightbulbOnOutline } from '@mdi/js'

const tips = [
  'Clique na tarefa para visualizar as ações disponíveis',
  'Segure e arraste a tarefa para reordenar'
]

class Tip extends Component {

  constructor(props) {
    super(props)
    this.state = { tip: this.randomFrom(tips) }
  }

  render() {
    return(
      <div style={styles.tip_wrapper} onClick={this.getRandomTip.bind(this)}>
        <Icon path={mdiLightbulbOnOutline} size={1}
              style={{fill: 'white'}} />
        <span style={styles.tip}>{this.state.tip}</span>
      </div>
    )
  }

  componentDidMount() {
    this.getRandomTip()
  }

  getRandomTip() {
    let available_tips = [...tips]
    const current_tip_index = tips.indexOf(this.state.tip)
    available_tips.splice(current_tip_index, 1)
    const tip = this.randomFrom(available_tips)
    this.setState({ tip: tip })
  }

  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)]
  }
}

const styles = {
  tip_wrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 10px'
  },
  tip: {
    fontSize: 14,
    marginLeft: 12,
    color: 'white',
    fontWeight: 'bold'
  }
}

export default Tip;
