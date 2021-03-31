import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import React, { Component } from 'react'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

const measures = {}

measures.Millisecond = 1
measures.Second = 1000
measures.Minute = measures.Second * 60
measures.Hour = measures.Minute * 60
measures.Day = measures.Hour * 24
measures.Week = measures.Day * 7
measures.Month = measures.Day * 30.5
measures.Year = measures.Day * 365

class IntervalSelector extends Component {
  constructor (props) {
    super(props)

    let measure
    let value

    const measureEntries = Object.entries(measures)

    for (let i = 0; i < measureEntries.length; i++) {
      const nextMeasureEntity = measureEntries[i + 1]

      if (nextMeasureEntity && this.props.value < nextMeasureEntity[1]) {
        measure = measureEntries[i][1]
        value = this.props.value / measure
        break
      }
    }

    this.state = {
      measure: measure,
      value: value
    }
  }

  getMenuItems (max, min) {
    if (!max) {
      max = measures.year
    } else if (!parseInt(max)) {
      max = measures[max]
    }

    if (!min) {
      min = measures.second
    } else if (!parseInt(min)) {
      min = measures[min]
    }

    const menuItems = []

    const measureEntries = Object.entries(measures)

    for (let i = 0; i < measureEntries.length; i++) {
      const nextMeasureEntity = measureEntries[i + 1]

      const key = measureEntries[i][0]
      const value = measureEntries[i][1]

      if ((!nextMeasureEntity || min < nextMeasureEntity[1]) && max >= value) { menuItems.push(<MenuItem key={key.toLowerCase()} value={value}>{key}(s)</MenuItem>) }
    }

    return menuItems
  }

  onChange (value, measure) {
    if (!measure) { measure = this.state.measure }

    if (!value) { value = this.state.value }

    this.setState({
      measure: measure,
      value: value
    })

    return this.props.onChange(measure * value)
  }

  render () {
    return (
      <FormControlLabel
        control={
          <div className='row'>
            <TextField
              className={this.props.textFieldClasses}
              defaultValue={this.state.value || 1}
              onInputCapture={event => this.onChange(event.target.value, null)}
              size={this.props.size || 'small'}
              type='number'
              variant={this.props.variant || 'outlined'}
            />
            <Select
              className={this.props.selectFieldClasses}
              onChange={event => this.onChange(null, event.target.value)}
              value={this.state.measure || measures.Millisecond}
              variant={this.props.variant || 'outlined'}
            >
              {this.getMenuItems(this.props.max, this.props.min)}
            </Select>
          </div>
            }
        label={this.props.label || 'Label'}
        labelPlacement={this.props.labelPlacement || 'left'}
      />
    )
  }
}

export default IntervalSelector
