import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
import * as Util from '../Util/index'
import * as CoinMarketCap from '../Util/CoinMarketCap'
import * as CoinGecko from '../Util/CoinGecko'
import abbreviate from 'number-abbreviate'
import { Skeleton } from '@material-ui/lab'

class PortfolioAreaStackChart extends Component {
  constructor (props) {
    super(props);

    const option = {
      tooltip: {
        axisPointer: {
          label: {
            formatter: (params) => {
              return Util.getLocalizedPrice(params.value, props.settings)
            }
          },
          type: 'cross'
        },
        formatter: (params) => {
          let tooltip = params[0].axisValue + "<br />"

          let portfolioValue = 0

          params.forEach(param => {
            tooltip += param.marker + param.seriesName + ": " + Util.getLocalizedPrice(Number(param.data), props.settings) + "<br />"

            portfolioValue += Number(param.data)
          })

          tooltip += "<br /> Portfolio: " + Util.getLocalizedPrice(portfolioValue, props.settings)

          return tooltip
        },
        showDelay: 1,
        trigger: 'axis'
      },
      legend: {
        bottom: 0,
        orient: 'horizontal',
        textStyle: {
          color: 'white'
        },
        type: 'scroll'
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          axisLabel: {
            formatter: (params) => {
              return Util.getCurrencySymbol(props.settings.currency) + abbreviate(params.toFixed(2), 2, ['K', 'M'])
            }
          },
          type: 'value'
        }
      ]
    };

    if (window.innerWidth <= 959) {
      option.yAxis[0].offset = -6
    }

    this.state = {
      hasAssets: props.assets.filter(asset => asset.holdings > 0).length > 0,
      option: option
    }

    this.getData(props.settings, props.assets);
  }

  async getData (settings, assets, days = 7) {
    const currency = settings.currency
    const assetsHeld = assets.filter(asset => asset.holdings > 0).sort((a, b) => (b.holdings * b.price) - (a.holdings  * a.price))

    let data

    if (this.props.settings.datasource === 'coinmarketcap') {
      data = await CoinMarketCap.getHistoricalAssetData(currency, assetsHeld.map(asset => asset.symbol).join(), days)
    }
    else {
      data = await CoinGecko.getHistoricalAssetData(currency, assetsHeld.map(asset => asset.cgId), days)
    }

    let dates = []
    let series = []

    let option = this.state.option

    if (data) {
      assetsHeld.map((asset, index) => {
        let values = []
        let assetData = data

        if (this.props.settings.datasource === 'coinmarketcap') {
          if (assetsHeld.length > 1) {
            assetData = data[asset.symbol].quotes
          }
        }
        else {
          assetData = data[index].prices
        }

        if (this.props.settings.datasource === 'coinmarketcap') {
          for (let [key, value] of Object.entries(assetData)) {
            const index = key

            if (assetsHeld.length > 1) {
              key = value.timestamp
              value = value.quote[currency].price
            } else {
              value = value[currency][0]
            }

            let date = `${new Date(key).getMonth() + 1}/${new Date(key).getDate()}`;

            if (!dates.includes(date)) {
              dates.push(date);
            }

            if (Number(index) === assetData.length - 1) {
              values.push(asset.price * asset.holdings)
            } else {
              values.push(value * asset.holdings);
            }
          }
        }
        else {
          assetData.map((granularDataset) => {

            if (index === 0) {
              let date = new Date(granularDataset[0])
              let min = date.getMinutes()

              date.setMinutes(Math.ceil(min / 10) * 10)
              date.setSeconds(0)

              dates.push(date.toLocaleString());
            }

            return values.push(granularDataset[1] * asset.holdings)
          })
        }

        return series.push({
          name: `${asset.name} (${asset.symbol})`,
          type: 'line',
          stack: 'portfolio',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: values
        });
      })
    }

    option.xAxis[0].data = dates
    option.series = series

    this.setState({
      option: option
    })
    this.echartsInstance.setOption(option, true)
  }

  componentDidMount () {
    this.echartsInstance = this.echartsReactRef.getEchartsInstance();
  }

  UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    const assetsHeld = nextProps.assets.filter(asset => asset.holdings > 0)

    if (nextProps.days || assetsHeld.length === 0) {
      this.getData(nextProps.settings, nextProps.assets, nextProps.days);
    }
  }

  render() {
    return (
      <div>
        <ReactECharts
          className={!this.state.option.series ? "d-none" : null}
          option={this.state.option}
          ref={(e) => {
            this.echartsReactRef = e;
          }}
          style={{ height: '100%', minHeight: '300px' }}
        />
        <Skeleton animation="wave" className="m-auto" hidden={this.state.option.series} height={300} width={'90%'} />
      </div>
    )
  }
}

export default PortfolioAreaStackChart