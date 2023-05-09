import { Button } from '@material-ui/core'
import React from 'react'
import './button.scss';
function CustomButton(props) {
  return (
    <Button className='button' {...props}>
      {props.buttonText ?? 'button'}
    </Button>
  )
}

export default CustomButton