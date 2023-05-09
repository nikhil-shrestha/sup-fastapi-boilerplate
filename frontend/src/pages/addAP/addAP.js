import {
  Box, Container, Dialog,
  Divider, Grid, List,
  ListItem, ListItemText,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import { default as React } from 'react'
import { QrReader } from 'react-qr-reader'
import { useHistory } from 'react-router-dom'
import CustomButton from '../../components/common/Button/button'
import './addAP.scss'


const AddAccessPoint = props => {
  const [open, setOpen] = React.useState(false)
  const [aPoint, setAPoint] = React.useState('')
  const router = useHistory()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = value => {
    setOpen(false)
  }

  const theme = useTheme();
  const mdScn = useMediaQuery(theme.breakpoints.down(1086));

  const handleNextStep = () => {
    router.push('/add-ap')
  }
  return (
    <Container component={Box} >

      <Grid container spacing={2} className='add_access_point'>
        <Grid item xs={12}>
          <Typography
            color='text'
            className='title'
          >
            Two ways to add an access point
          </Typography>
          <Divider />
        </Grid>
        <Grid item md={5} xs={12}>
          <Paper className='paper' elevation={0}>
            <Box>
              <Box className='header' p={2}>
                <Typography
                  className='content'
                >
                  Enter the serial number
                </Typography>
              </Box>
              <Box p={2} pb={8}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography className='content black_font'>
                          {' '}
                          1. Check the backside of your 5-Fi access point for a
                          11 digit serial number
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography className='content black_font'>
                          {' '}
                          2. Enter the code
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>

                <Grid container>
                  <Grid item xs={3}>
                    <TextField
                      id='filled-basic'
                      InputProps={{
                        disableUnderline: true,
                        className: 'form_textfield'

                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Box className='align_sign'>-</Box>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      id='filled-basic'
                      InputProps={{
                        disableUnderline: true,
                        className: 'form_textfield'

                      }}
                      value={aPoint}
                      onChange={e => setAPoint(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Box display={'flex'} justifyContent={'center'} pt={7}>
                  {aPoint && <CustomButton
                    onClick={() => handleNextStep()}
                    buttonText='Continue'
                    size="large"
                    className="button"

                  />}
                </Box>

              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className='align_sign'>OR</Box>
        </Grid>
        <Grid item md={5} xs={12}>
          <Paper className='paper' elevation={0}>
            <Box>
              <Box className='header' p={2}>
                <Typography
                  color='text'
                  className='content'
                >
                  Enter the serial number
                </Typography>
              </Box>
              <Box p={mdScn ? 1 : 2} pb={mdScn ? 0 : 8} className="testt">
                <List>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography className='content black_font'>
                          {' '}
                          1. If you are using a device with a camera:
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <List disablePadding>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box className='align_item'>
                              &#x2022;
                              <Typography className='sub_content black_font'>
                                Click the button below to open QR code scanner
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box className='align_item'>
                              &#x2022;
                              <Typography className='sub_content black_font'>
                                Point the camera to QR code located on the back
                                of your 5-Fi access point
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </ListItem>
                </List>
                <Box display={'flex'} justifyContent={'center'} className="btnWrapper">
                  <CustomButton
                    onClick={handleClickOpen}
                    buttonText='Click to scan QR code'
                  />
                  <QrScannerModal
                    {...props}
                    open={open}
                    setAPoint={setAPoint}
                    handleClose={handleClose}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

const QrScannerModal = props => {
  const { open, handleClose, setAPoint } = props
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='simple-dialog-title'
      open={open}
    >
      <Box pt={'10px'} textAlign={'center'} width={'300px'}>
        <Paper elevation={0}>
          <Typography className='content'>
            Scan Qr
          </Typography>
          <QrReader
            constraints={{
              facingMode: 'environment'
            }}
            onResult={(result, error) => {
              if (!!result) {
                setAPoint(result?.text)
                handleClose()
              }

              if (!!error) {
                console.info(error)
                // setTimeout(() => {
                //     notify.show("Invalid QR", "custom", props.toaster.duration, props.toaster.error);
                // }, 2000)
              }
            }}
            style={{ width: '100%' }}
          />
        </Paper>
      </Box>
    </Dialog>
  )
}
export default AddAccessPoint