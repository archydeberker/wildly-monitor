import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import SearchPanel from '../components/google-maps/SearchPanel'
import { Grid, Paper } from '@material-ui/core';
import CreatableSelect from 'react-select/creatable';
import InputLabel from '@material-ui/core/InputLabel'
import MapView from '../components/google-maps/MapView'

import {getLocations} from '../api/Get'
import { useTheme } from '@material-ui/styles';
import RecommendedLocations from '../components/RecommendedLocations';



const styles = {
  paperContainer: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1468571452166-b089f160f1c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1510&q=80)',
    height: '100vh',
    width: '100vw',
  },
}
const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    paddingLeft: '5%'
  },
  backButton: {
    marginRight: theme.spacing(1),
    marginLeft: '40%',
    align: 'bottom'
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const extractLngLat = (location) => {
  return location ? {lat: location[0].geometry.location.lat(),
          lng: location[0].geometry.location.lng()}:
          {lat: 45.95, lng: -73.33}
}

function UserInfo(setLocation, setActivities) {

    const activities = ['climb', 'run', 'hike', 'paddle', 'camp'].map(input => ({label:input, value: input}))
    return  <>
            <Grid item  xs={12}> 
                <div style={{height:'300px', paddingBottom: '80px'}}>
                     <SearchPanel label='Where do you live?' placeholder='Montreal, QC' onSelect={setLocation}/></div> </Grid> 
                <Grid item  xs={12}>
                <InputLabel shrink color='primary' style={{paddingTop: 25}}>
          What do you like to do outdoors?
          </InputLabel>
                <CreatableSelect
                    isMulti
                    label="activities"
                    options={activities}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(value)=>setActivities(value)}
                    style={{paddingTop: 200}}
          /> 
          </Grid>
          </>

}

const SuggestedLocations = (props) => {

  let {location, locationList, activities} = props
  locationList = locationList.map(entry => entry.value).slice(1, 4)


  return (<>
    <Grid item xs={12}>
    </Grid>
    <Grid item  xs={12}> 
      <MapView locationList={locationList} height='300px' center={extractLngLat(location)}/>
    </Grid>
    <Grid item  xs={12}> 
    <RecommendedLocations locationList={locationList} 
                          userLocation={extractLngLat(location)}
                          userActivities={activities}/>
    </Grid>
  </>)
}

function getSteps() {
  return ['About you', 'Suggested locations'];
}

function GetStepTitle(stepIndex) {
  switch (stepIndex) {
    case 0: 
      return"You're almost ready to get after it"
    case 1:
      return "Some locations you might like to add to Wildly"
  }
}
function GetStepContent(stepIndex) {
  const [userLocation, setLocation] = React.useState(null)
  const [locationList, setLocationList] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {{getLocations(setLocationList)}}, [])
  
  switch (stepIndex) {
    case 0:
      return UserInfo(setLocation, setActivities);
    case 1:
      return <SuggestedLocations location={userLocation} locationList={locationList} activities={activities}/>; 
    default:
      return 'Unknown stepIndex';
  }
}

export default function HorizontalLabelPositionBelowStepper() {
  
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  
  return (
    <Paper style={styles.paperContainer}>
    <Grid
        container
        spacing={16}
        direction="row"
        alignItems="center"
        justify="center"
        style={{paddingTop: '2vh'}}
        >
    <Grid item xs={6}>
    <Card style={{height: '95vh'}}>
    <div className={classes.root}>
    <Typography variant='h6' style={{textAlign:"center", paddingTop: '20px', paddingBottom: '20px'}}>{GetStepTitle(activeStep)}</Typography>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{GetStepContent(activeStep)}</Typography>
          </div>
        )}
      </div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
    </div>
    </Card>
    </Grid>
    </Grid>
    </Paper>

  );
}

function test() {
    return(
    <Grid
        container
        spacing={16}
        direction="row"
        alignItems="center"
        justify="center"
        >
<Grid item  xs={6}>
    <Card width="100%">Hey</Card>
    </Grid>
    <Grid item  xs={6}>
    <Card width="100%">Hey</Card>
    </Grid>
    </Grid>
)}