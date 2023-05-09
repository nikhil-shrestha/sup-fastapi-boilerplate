import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import axios from 'axios';

import Themes from "./themes";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome/styles.css';

import Home from './home';
import { updateConfig } from './store/siteCoordinator/siteCoordinator.actions'


function App() {
    const dispatch = useDispatch()

    const [state, setState] = useState({
        config: {},
        doneFetchingData: false
    });

    useEffect(() => {
        getConfig();


    }, [])

    const getConfig = () => {
        axios.get('configure.json')
            .then(function (res) {

                var config = res.data;
                setState({ config, doneFetchingData: true });
                dispatch(updateConfig(config))

            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred config in appjs');
            });
    }

    const { doneFetchingData } = state;

    return (
        doneFetchingData ?
            <ThemeProvider theme={Themes.default}>
                <CssBaseline />
                <Home />
            </ThemeProvider>
            : ''
    );

}

export default App;
