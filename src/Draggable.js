import React, { Component } from 'react';
import Icon from '@mdi/react'
import { mdiLightbulbOnOutline } from '@mdi/js'
import { closest } from './utils';

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
      initialY: null,
      limit_reach: false
    }
  }

  render() {
    return(
      <div ref={(ref) => this.container = ref} className="drag-container">
        <div ref={(ref) => this.dragItem = ref}>
          {this.props.children}
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.container.addEventListener("touchstart", this.dragStart.bind(this), false);
    this.container.addEventListener("touchend", this.dragEnd.bind(this), false);
    this.container.addEventListener("touchmove", this.drag.bind(this), false);

    this.container.addEventListener("mousedown", this.dragStart.bind(this), false);
    this.container.addEventListener("mouseup", this.dragEnd.bind(this), false);
    this.container.addEventListener("mousemove", this.drag.bind(this), false);
  }


  dragStart(e) {
    if (e.type === "touchstart") {
      this.setState({
        initialX: e.touches[0].clientX - this.state.xOffset,
        initialY: e.touches[0].clientY - this.state.yOffset,
        limit_reach: false
      })
    } else {
      this.setState({
        initialX: e.clientX - this.state.xOffset,
        initialY: e.clientY - this.state.yOffset,
        limit_reach: false
      })
    }

    if (e.target == this.dragItem || closest(e.target, '.drag-container')) {
      this.state.active = true;
    }
  }

  dragEnd(e) {
    if(this.props.onLimitRelease && Math.abs(this.state.xOffset) >= this.props.limit) {
      this.props.onLimitRelease()
    }

    const resetOnDragEnd = this.props.resetOnDragEnd || false
    if(resetOnDragEnd) {
      this.setState({
        currentX: null, currentY: null,
        xOffset: 0, yOffset: 0,
        initialX: null, initialY: null
      }, () => {
        this.setTranslate(0, this.state.currentY, this.dragItem);
      })
    } else {
      this.setState({
        initialX: this.state.currentX,
        initialY: this.state.currentY
      })
    }

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
      }, () => {
        if(this.props.onLimitReach && !this.state.limit_reach &&
            Math.abs(this.state.xOffset) >= this.props.limit) {
          this.props.onLimitReach()
          this.setState({ limit_reach: true })
        }

        if(this.props.onLimitReced && this.state.limit_reach &&
            Math.abs(this.state.xOffset) < this.props.limit) {
          this.props.onLimitReced()
          this.setState({ limit_reach: false })
        }
      })

      this.setTranslate(this.state.currentX, this.state.currentY, this.dragItem);
    }
  }

  setTranslate(xPos, yPos, el) {
    const weight = this.props.weight || 1
    el.style.transform = "translateX(" + xPos/weight + "px)";
  }
}

export default Draggable;
