import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Page from '../../components/page';
import CurrentTimePanel from './components/currentTimePanel';
import ConvertTimePanel from './components/convertTimePanel';


export default class EpochTime extends React.Component<RouteComponentProps> {
  render(): React.ReactNode {
    return (
      <Page title='Epoch Time'>
        <CurrentTimePanel/>
        <ConvertTimePanel/>
      </Page>
    );
  }
}

