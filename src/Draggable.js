import React, { Component } from 'react';
import Icon from '@mdi/react'
import { mdiLightbulbOnOutline } from '@mdi/js'

class Draggable extends Component {

  constructor(props) {
    super(props)

    this.state = {
      active: false,
      currentX: null,
      currentY: null,
      xOffset: 0,
      yOffset: 0,
      initialX: null,
      initialY: null
    }
  }

  render() {
    return(
      <div style={styles.tip_wrapper} onClick={this.nextDraggable.bind(this)}>
        <Icon path={mdiLightbulbOnOutline} size={1}
          style={{fill: 'white'}} />
        <div style={{overflow: 'hidden'}} ref={(ref) => this.tipWrapper = ref}>
          <div style={{display: 'flex', flexDirection: 'column', transition: 'transform 0.1s ease-out', willChange: 'transform'}} ref={(ref) => this.currentDraggableInnerWrapper = ref}>
            <span ref={(ref) => this.currentDraggableRef = ref} style={styles.tip}>{this.state.tip}</span>
            <span ref={(ref) => this.nextDraggableRef = ref} style={styles.tip}>{this.state.next_tip}</span>
          </div>
        </div>
      </div>
    )
  }

  dragStart(e) {
    if (e.type === "touchstart") {
      this.setState({
        initialX: e.touches[0].clientX - this.state.xOffset,
        initialY: e.touches[0].clientY - this.state.yOffset
      })
    } else {
      this.setState({
        initialX: e.clientX - this.state.xOffset,
        initialY: e.clientY - this.state.yOffset
      })
    }

    if (e.target == this.todo || closest(e.target, '.todo')) {
      this.state.active = true;
    }
  }

  dragEnd(e) {
    this.setState({
      initialX: this.state.currentX,
      initialY: this.state.currentY
    })

    this.setState({ active: false })
  }

  drag(e) {
    if (this.state.active) {

      e.preventDefault();

      if (e.type === "touchmove") {
        this.setState({
          currentX: e.touches[0].clientX - this.state.initialX,
          currentY: e.touches[0].clientY - this.state.initialY
        })
      } else {
        this.setState({
          currentX: e.clientX - this.state.initialX,
          currentY: e.clientY - this.state.initialY
        })
      }

      this.setState({
        xOffset: this.state.currentX,
        yOffset: this.state.currentY
      })

      this.setTranslate(this.state.currentX, this.state.currentY, this.todo);
    }
  }

  setTranslate(xPos, yPos, el) {
    // el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    el.style.transform = "translateX(" + xPos/3 + "px)";
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
    fontWeight: 'bold',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center'
  }
}

export default Draggable;
