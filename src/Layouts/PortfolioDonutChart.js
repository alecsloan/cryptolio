import React from 'react'
import ReactECharts from 'echarts-for-react';
import * as Util from '../Util'
import { Grid } from '@material-ui/core'
import LayoutHandler from './LayoutHandler'
import MobileAssetTable from './MobileAssetTable'

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
    <Grid container style={{ width: '99%' }}>
      <Grid item xs={12} md={2}>
        <ReactECharts option={option} style={{ height: '100%', minHeight: '300px' }} />
      </Grid>
      <Grid item xs={12} md={10}>
        {
          (window.innerWidth <= 500 && props.assets.length > 0)
            ? <MobileAssetTable {...props} />
            : <LayoutHandler assets={props.assets} editSetting={props.editSetting.bind(this)} renderStyle={props.settings.renderSubStyle || "card:classic"} settings={props.settings} setAssetPanelShown={props.setAssetPanelShown.bind(this)} />
        }
      </Grid>
    </Grid>
  )
}

export default PortfolioDonutChart
