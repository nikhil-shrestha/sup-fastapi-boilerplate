import { Grid, Typography } from '@material-ui/core'
import React from 'react'
import Widget from '../../components/Widget/Widget'
import './showOutput.scss';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AdjustIcon from '@material-ui/icons/Adjust'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'



function ShowOutput() {
  return (
    <div className='showOutput'>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Widget
            title="Harbour  Farm and Vineyard​"
            upperTitle
            bodyclassName={''}
            className="network-summary-title"
            disableWidgetMenu={true}
          >
            <Grid container spacing={2}>
              <Grid justify='center' item xs={12}>
                <div className="fgm-util-each ">
                  <span className="fgm-util-each-title">Location</span>
                  <span className="fgm-util-each-value">Ramona, CA, USA</span>
                </div>

              </Grid>
              <Grid justify='center' item xs={12}>
                <div className="fgm-util-each ">
                  <span className="fgm-util-each-title">Drone ID</span>
                  <span className="fgm-util-each-value">A1</span>
                </div>

              </Grid>

            </Grid>
          </Widget>
        </Grid>
        <Grid item xs={6}>
          <Widget
            title=""
            upperTitle
            bodyclassName={''}
            className={''}
            disableWidgetMenu={true}
          >
            <Grid container spacing={2}>
              <Grid justify='center' item xs={12}>
                <div className="fgm-util-each ">
                  <span className="fgm-util-each-title">Drone Status
                  </span>
                  <span className="fgm-util-each-value">Online
                    <CheckCircleIcon className='valid_tick' />

                  </span>
                </div>

              </Grid>
              <Grid justify='center' item xs={12}>
                <div className="fgm-util-each ">
                  <span className="fgm-util-each-title">Live stream</span>
                  <span className="fgm-util-each-value">A1
                    <FiberManualRecordIcon className='stream' />
                  </span>
                </div>

              </Grid>

            </Grid>
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Widget
            title=""
            upperTitle
            bodyclassName={''}
            className="network-summary-title"
            disableWidgetMenu={true}
          >
            <iframe width="100%" height="415" src="https://wplandingpag.vps.webdock.cloud/demo2/tensorflow-js-image-classification/player.html" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </Widget>
        </Grid>
      </Grid>


    </div>
  )
}

export default ShowOutput