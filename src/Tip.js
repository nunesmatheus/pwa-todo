import React, { Component } from 'react';
import Icon from '@mdi/react'
import { mdiLightbulbOnOutline } from '@mdi/js'

const tips = [
  'Clique na tarefa para editar',
  'Segure e arraste as tarefas para reordenar',
  'Remova as tarefas arrastando para a esquerda'
]

class Tip extends Component {

  constructor(props) {
    super(props)

    let available_tips = [...tips]
    const tip = this.randomFrom(tips)
    const tip_index = tips.indexOf(tip)
    let next_available_tips = [...tips]
    const next_tip_index = tips.indexOf(tip)
    next_available_tips.splice(next_tip_index, 1)
    const next_tip = this.randomFrom(next_available_tips)

    this.state = {
      tip: tip,
      next_tip: next_tip
    }
  }

  render() {
    return(
      <div style={styles.tip_wrapper} onClick={this.nextTip.bind(this)}>
        <Icon path={mdiLightbulbOnOutline} size={1}
              style={{fill: 'white'}} />
        <div style={{overflow: 'hidden'}} ref={(ref) => this.tipWrapper = ref}>
          <div style={{display: 'flex', flexDirection: 'column', transition: 'transform 0.1s ease-out', willChange: 'transform'}} ref={(ref) => this.currentTipInnerWrapper = ref}>
            <span ref={(ref) => this.currentTipRef = ref} style={styles.tip}>{this.state.tip}</span>
            <span ref={(ref) => this.nextTipRef = ref} style={styles.tip}>{this.state.next_tip}</span>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    if(this.currentTipRef.offsetHeight > this.nextTipRef.offsetHeight)
      this.nextTipRef.style.height = `${this.currentTipRef.offsetHeight}px`
    else
      this.currentTipRef.style.height = `${this.nextTipRef.offsetHeight}px`
    this.tipWrapper.style.height = `${this.currentTipRef.offsetHeight}px`
  }

  nextTip() {
    let available_tips = [...tips]
    const current_tip_index = tips.indexOf(this.state.next_tip)
    available_tips.splice(current_tip_index, 1)
    let tip = this.randomFrom(available_tips)
    this.tipWrapper.style.height = `${this.nextTipRef.offsetHeight}px`
    this.currentTipInnerWrapper.style.transform = `translateY(-${this.currentTipRef.offsetHeight}px)`
    setTimeout(() => {
      this.currentTipInnerWrapper.style.transition = 'none'
      this.currentTipInnerWrapper.style.transform = `translateY(0px)`

      this.setState({ tip: this.state.next_tip, next_tip: tip }, () => {
        this.currentTipInnerWrapper.style.transition = 'transform 0.1s ease-out'
      })
    }, 100)

    if(this.currentTipRef.offsetHeight > this.nextTipRef.offsetHeight)
      this.nextTipRef.style.height = `${this.currentTipRef.offsetHeight}px`
    else
      this.currentTipRef.style.height = `${this.nextTipRef.offsetHeight}px`
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
    marginLeft: 16,
    color: 'white',
    fontWeight: 'light',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center'
  }
}

export default Tip;
