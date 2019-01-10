import * as React from 'react';
import moment from 'moment';
import Panel from '../../../components/panel';
import EpochValue from './epochValue';
import RefreshButton from './refreshButton';

interface CurrentTimeState {
  seconds: number;
  milliseconds: number;
  isoTime: string;
  localTime: string;
}

export default class CurrentTimePanel extends React.Component<{}, CurrentTimeState> {

  constructor(props: {}) {
    super(props);
    this.state = this.refreshTimeState();
  }



  private refreshTimeState(): CurrentTimeState {
    const m = moment();

    return {
      seconds: m.unix(),
       milliseconds: m.valueOf(),
      isoTime: m.toISOString(),
      localTime: m.format('DD-MMM-YYYY HH:mm:ss.SSS'),
    };
  }

  private onClickRefresh(): void {
    this.setState(this.refreshTimeState());
  }


  render(): React.ReactNode {

    const widget = <RefreshButton onRefresh={() => this.onClickRefresh()} />;

    return (
      <Panel title={'Current Epoch Time'} widget={widget}>
        <div>
          <EpochValue label={'seconds'} value={this.state.seconds.toString()}/>
        </div>
        <div>
          <EpochValue label={'milliseconds'} value={this.state.milliseconds.toString()}/>
        </div>
        <div>
          <EpochValue label={'ISO 8601 (UTC)'} value={this.state.isoTime}/>
        </div>
        <div>
          <EpochValue label={'local date/time'} value={this.state.localTime}/>
        </div>
      </Panel>
    );
  }
}
