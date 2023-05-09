import { Box, Collapse, Paper, Typography } from '@material-ui/core'
import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import loadingGif from '../../images/home/loading.gif'



const Accordion = ({ title, children, loading, enableValidation, valid, initChecked = false }) => {
  const [checked, setChecked] = React.useState(initChecked)
  React.useEffect(() => {
    setChecked(initChecked)

  }, [initChecked])



  console.log(checked)
  return (
    <div className='accordion_container'>

      <Collapse className='accordion_collapse' in={checked} collapsedHeight={64}>
        <Box component={Paper} elevation={0} pl={3} pr={3}  >
          <Box className='accordion_header' onClick={() => children && setChecked((prev) => !prev)} display={'flex'} justifyContent={'space-between'}>
            <Box display={'flex'} alignItems={'center'} gridGap={'8px'}>
              {enableValidation && < CheckCircleIcon
                fontSize='medium'
                className={valid ? 'valid_tick' : 'invalid_tick'}
              />}
              <Typography className='accordion_title'>
                {title ?? 'title'}
              </Typography>
              {loading && <img className='loading' src={loadingGif} alt={'loadng'} />
              }
            </Box>

            {children && <ExpandMoreIcon className={checked ? 'rotate_icon' : 'normal_icon'} />}
          </Box>
          {children && <Box pl={3} p={2}>
            {children}
          </Box>}
        </Box>
      </Collapse>
    </div>


  )
}


export default Accordion