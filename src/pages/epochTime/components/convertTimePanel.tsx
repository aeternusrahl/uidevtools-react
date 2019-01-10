import * as React from 'react';
import Panel, { PanelRow } from '../../../components/panel';
import styles from './convertTimePanel.module.scss';
import { Moment } from 'moment';
import moment from 'moment';
import EpochValue from './epochValue';



function filterInt(value: any) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
}

function safeBind(value: any): string {
  return value ? value.toString() : '';
}

type ResultState = 'empty' | 'invalid' | 'show-epoch' | 'show-datetime';

// year 3000. above this value, assume epoch millis
const epochBreakpoint = 32503680000;


interface PanelState {
  rawInput?: string;
  resultState: ResultState;
  epochSeconds?: number;
  isoTime?: string;
  localDateTime?: string;
}


export default class ConvertTimePanel extends React.Component<{}, PanelState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      resultState: 'empty'
    };
  }

  onInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    let m: Moment;
    const value = e.target.value;


    this.setState({
      rawInput: value,
      epochSeconds: undefined
    });

    // if no data is entered, reset the form
    if (!value || value === '') {
      this.setState({resultState: 'empty'});
      return;
    }


    // if user entered an integer value, assume it is epoch seconds or millis
    const num = filterInt(value);
    if (!Number.isNaN(num)) {
      m = moment.unix(num < epochBreakpoint ? num : num / 1000);
      if (m.isValid()) {
        // user entered epoch seconds, show date time
        this.setState({
          resultState: 'show-datetime',
          isoTime: m.toISOString(),
          localDateTime: m.format('DD-MMM-YYYY HH:mm:ss.SSS')
        });

      }
    }
    // otherwise try to parse it as a string-form date and time
    else {
      m = moment(value);
      if (m.isValid()) {
        // user entered date/time, show epoch seconds
        this.setState({
          resultState: 'show-epoch',
          epochSeconds: m.unix()
        });
      }
    }

    // if we got here and it's invalid, then we know it didn't satisfy either
    // of the conditions above
    if (!m.isValid()) {
      this.setState({resultState: 'invalid'});
    }

  }


  private renderConversionResults(): React.ReactNode {
    switch (this.state.resultState) {
      case 'invalid':
        return (
          <PanelRow><span className='subtitle'>Please enter a valid date and time</span></PanelRow>
        );

      case 'show-epoch':
        return (
          <PanelRow><EpochValue label={'seconds'} value={safeBind(this.state.epochSeconds)}/></PanelRow>
        );

      case 'show-datetime':
        return (
          <>
            <PanelRow>
              <EpochValue label={'ISO 8601 (UTC)'} value={safeBind(this.state.isoTime)}/>
            </PanelRow>
            <PanelRow>
              <EpochValue label={'local date/time'} value={safeBind(this.state.localDateTime)}/>
            </PanelRow>
          </>
        );

      default:
        return undefined;
    }
  }

  render(): React.ReactNode {
    return (
      <Panel title={'Convert Epoch Time'}>
        <div className={styles.inputRow}>
          <input type='text'
                 placeholder='Enter epoch seconds or date & time'
                 value={this.state.rawInput}
                 onChange={(e) => this.onInputChanged(e)}
          />
          <div className={styles.label}>Enter epoch seconds or a valid <a href='https://momentjs.com/docs/#/parsing/string/' target='_blank' className={'link'}>ISO 8601 or RFC 2822 date and time</a>.<br/>Times will be parsed in local time zone unless another offset is specified. Use Z for UTC.</div>
        </div>
        <div className={styles.conversionResults}>
          {this.renderConversionResults()}
        </div>
      </Panel>
    );
  }

}
