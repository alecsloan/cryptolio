import React from 'react'
import ReactECharts from 'echarts-for-react';
import * as Util from '../Util/index'

function PortfolioDonutChart (props) {
  const option = {
    tooltip: {
      formatter: (params) => {
        return (
          params.name + ": " + Util.getLocalizedPrice(params.data.holdings * params.data.price, props.settings) +
          "<br />Holdings: " + Util.getLocalizedNumber(Number(params.data.holdings), props.settings)
        )
      },
      position: 'right',
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      top: '175px',
      textStyle: {
        color: 'white'
      }
    },
    series: [
      {
        avoidLabelOverlap: true,
        center: ['50%', '75px'],
        data: props.assets.sort((a, b) => ((b.holdings || 0.000001) * b.price) - ((a.holdings || 0.000001) * a.price)).map(asset => ({holdings: asset.holdings, name: `${asset.name} (${asset.symbol})`, price: asset.price, value: (asset.holdings * asset.price).toFixed(2)})),
        itemStyle: {
          borderRadius: 5,
          borderWidth: 5
        },
        label: {
          show: false,
          position: 'center'
        },
        name: 'Asset',
        radius: ['40%', '70%'],
        type: 'pie'
      }
    ]
  };

  if (window.innerWidth <= 959) {
    option.legend.top = '80%';
    option.legend.type = 'scroll';
    option.tooltip.position = 'bottom';
    option.series[0].center = ['50%', '35%'];
  }

  return (
    props.settings.showPortfolioDonut
      ? <ReactECharts option={option} style={{ height: '100%', minHeight: '300px' }} />
      : null
  )
}

export default PortfolioDonutChart
