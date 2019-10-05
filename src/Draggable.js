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
      limit_reach: false,
      scrolling: false
    }

    this.resetScrollTimeoutFn = this.resetScrollTimeout.bind(this)
  }

  render() {
    return(
      <div style={this.props.style} ref={(ref) => this.container = ref} className="drag-container">
        <div ref={(ref) => this.dragItem = ref}>
          {this.props.children}
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.scrollInterval = null
    this.container.addEventListener("touchstart", this.dragStart.bind(this), false);
    this.container.addEventListener("touchend", this.dragEnd.bind(this), false);
    this.container.addEventListener("touchmove", this.drag.bind(this), false);

    this.container.addEventListener("mousedown", this.dragStart.bind(this), false);
    this.container.addEventListener("mouseup", this.dragEnd.bind(this), false);
    this.container.addEventListener("mousemove", this.drag.bind(this), false);

    document.querySelector('main').addEventListener('scroll', (event) => {
      if(this.scrollInterval) {
        clearTimeout(this.scrollInterval)
      }

      if(this.state.scrolling) return

      event.target.removeEventListener('touchend', this.resetScrollTimeoutFn)
      event.target.removeEventListener('mouseup', this.resetScrollTimeoutFn)
      event.target.addEventListener('touchend', this.resetScrollTimeoutFn)
      event.target.addEventListener('mouseup', this.resetScrollTimeoutFn)
      this.setState({ scrolling: true })
    })
  }

  resetScrollTimeout() {
    this.setState({ scrolling: false })
    this.scrollInterval = null
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
        this.setTranslate(0, 0, this.dragItem);
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
    if(this.state.currentX && this.state.currentX > 20) e.preventDefault()

    if (this.state.active && !this.blockDrag()) {
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

  blockDrag() {
    return this.props.blockDrag || this.state.scrolling
  }
}

export default Draggable;
