import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
import * as Util from '../Util'
import * as CoinMarketCap from '../Util/CoinMarketCap'
import * as CoinGecko from '../Util/CoinGecko'
import abbreviate from 'number-abbreviate'
import { Skeleton } from '@material-ui/lab'
import { Grid } from '@material-ui/core'
import TimeframeSelector from '../Components/TimeframeSelector'
import SortSelector from '../Components/SortSelector'
import LayoutHandler from './LayoutHandler'
import MobileAssetCardGallery from './MobileAssetCardGallery'

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
        confine: true,
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
          color: props.settings.theme.palette.text.primary
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
              return Util.getCurrencySymbol(props.settings.currency) + abbreviate(params, 0, ['K', 'M'])
            }
          },
          max: (value) => {
            return value.max
          },
          type: 'value'
        }
      ]
    };

    if (window.innerWidth <= 959) {
      option.yAxis[0].axisLabel.fontSize = 10
      option.yAxis[0].offset = -3
    }

    this.state = {
      option: option
    }

    this.getData(props.settings, props.assets);
  }

  async getData (settings, assets) {
    let days = 7

    if (settings.balanceChangeTimeframe === "percent_change_1h") {
      days = .0417
    }
    else if (settings.balanceChangeTimeframe === "percent_change_24h") {
      days = 1
    }
    else {
      days = Number(settings.balanceChangeTimeframe.replace(/[^0-9]/g, ''))
    }

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
            const i = key

            if (assetsHeld.length > 1) {
              key = value.timestamp
              value = value.quote[currency].price
            } else {
              value = value[currency][0]
            }

            if (days > 29) {
              let date = `${new Date(key).getMonth() + 1}/${new Date(key).getDate()}`;

              if (!dates.includes(date)) {
                dates.push(date);
              }
            }
            else if (index === 0) {
              let date = new Date(key)

              date.setMinutes(0)
              date.setSeconds(0)

              dates.push(date.toLocaleString(navigator.language, { dateStyle: "medium", hour12: true, timeStyle: "short" }));
            }

            if (Number(i) === assetData.length - 1) {
              values.push(asset.price * asset.holdings)
            } else {
              values.push(value * asset.holdings);
            }
          }
        }
        else {
          assetData?.map((granularDataset) => {
            if (index === 0) {
              let date = new Date(granularDataset[0])
              let min = date.getMinutes()

              date.setMinutes(Math.ceil(min / 10) * 10)
              date.setSeconds(0)

              dates.push(date.toLocaleString(navigator.language, { dateStyle: "medium", hour12: true, timeStyle: "short" }));
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

    option.series = series
    option.tooltip.show = settings.showPortfolioBalance
    option.xAxis[0].data = dates
    option.yAxis[0].show = settings.showPortfolioBalance

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

    if (nextProps.settings || assetsHeld.length === 0) {
      this.getData(nextProps.settings, nextProps.assets);

      let option = this.state.option

      option.legend.textStyle.color = nextProps.settings.theme.palette.text.primary

      this.setState({
        option: option
      })
    }
  }

  render() {
    return (
      <div>
        <ReactECharts
          className={!this.state.option.series ? "d-none" : "mb-2"}
          option={this.state.option}
          ref={(e) => {
            this.echartsReactRef = e;
          }}
          style={{ height: '100%', minHeight: '300px' }}
        />
        <Skeleton animation="wave" className="m-auto" hidden={this.state.option.series} height={300} width={'90%'} />

        <Grid container>
          <Grid item xs={6}>
            <TimeframeSelector balanceChangeTimeframe={this.props.settings.balanceChangeTimeframe} editSetting={this.props.editSetting} />
          </Grid>

          <Grid item xs={6}>
            <SortSelector editSetting={this.props.editSetting} sorting={this.props.settings.sorting} />
          </Grid>
        </Grid>

        {
          (window.innerWidth <= 500 && this.props.assets.length > 0)
            ? <MobileAssetCardGallery assets={this.props.assets} settings={this.props.settings} setAssetPanelShown={this.props.setAssetPanelShown.bind(this)} />
            : <LayoutHandler assets={this.props.assets} editSetting={this.props.editSetting.bind(this)} removeCrypto={this.props.removeCrypto.bind(this)} renderStyle={this.props.settings.renderSubStyle || "card:classic"} settings={this.props.settings} setAssetPanelShown={this.props.setAssetPanelShown.bind(this)} />
        }
      </div>
    )
  }
}

export default PortfolioAreaStackChart