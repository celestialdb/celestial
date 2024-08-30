import React, { Fragment } from 'react';
// import {useSelector} from "react-redux";

import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import Toast from './Toast';
import RoutesLocal from './Routes';


// We're importing .css because @font-face in styled-components causes font files
// to be constantly re-requested from the server (which causes screen flicker)
// https://github.com/styled-components/styled-components/issues/1593
import './fontStyles.css';
// import {useGetProjectQuery} from "celestial/projectsData";
// import {useGetIssuesQuery} from "celestial/issuesData";


function App() {
    // useGetProjectQuery();
    // useGetIssuesQuery();
    // console.log("---- state after rtk query: ", useSelector((state) => state));


    return (<Fragment>
        <NormalizeStyles/>
        <BaseStyles/>
        <Toast/>
        <RoutesLocal/>
    </Fragment>);
}

export default App;
