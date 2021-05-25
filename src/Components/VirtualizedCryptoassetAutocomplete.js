import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { VariableSizeList } from 'react-window'
import PropTypes from 'prop-types'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ListSubheader from '@material-ui/core/ListSubheader'
import { useTheme } from '@material-ui/core/styles'

const LISTBOX_PADDING = 8 // px

function renderRow (props) {
  const { data, index, style } = props
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING
    }
  })
}

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})

function useResetCache (data) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent (props, ref) {
  const { children, ...other } = props
  const itemData = React.Children.toArray(children)
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48
    }

    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width='100%'
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType='ul'
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})

ListboxComponent.propTypes = {
  children: PropTypes.node
}
class VirtualizedCryptoassetAutocomplete extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inputValue: ''
    }
  }

  render () {
    return (
      <Autocomplete
        autoHighlight
        blurOnSelect
        className='h-100 w-100'
        clearOnBlur
        disableListWrap
        disablePortal
        getOptionLabel={(option) => `${option.name || ''} (${option.symbol})`}
        id='cryptoassets'
        inputValue={this.state.inputValue}
        ListboxComponent={ListboxComponent}
        onChange={
          (event, cryptoasset) => {
            if (cryptoasset) {
              this.props.addCrypto(cryptoasset.cgId, cryptoasset.cmcId, cryptoasset.symbol)

              this.setState({
                inputValue: ''
              })
            }
          }
        }
        onInputChange={
          (event, value) => {
            this.setState({
              inputValue: value
            })
          }
        }
        options={this.props.options}
        renderInput={(params) => <TextField {...params} label='Add Cryptoasset' variant='outlined' />}
        size='small'
        value={null}
      />
    )
  }
}

export default VirtualizedCryptoassetAutocomplete
