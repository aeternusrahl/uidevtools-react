import * as React from 'react';
import Page from '../../components/page';
import styles from './json.module.scss';
import { ShakeablePanel } from '../../components/shakeablePanel';
import { Subject } from 'rxjs';

interface JsonState {
  text: string;
  indentSpaces: number;
  enableFormat: boolean;

}

export default class Json extends React.Component<{}, JsonState> {

  private readonly textElementRef: React.RefObject<HTMLTextAreaElement>;
  private errorSubject = new Subject<any>();
  private error$ = this.errorSubject.asObservable();

  constructor(props: {}) {
    super(props);
    this.state = {
      text: '',
      enableFormat: false,
      indentSpaces: 2
    };

    this.textElementRef = React.createRef();
  }


  private onTextChanged(e: React.FormEvent<HTMLTextAreaElement>): void {
    const text = e.currentTarget.value;
    this.setState({
      text: text,
      enableFormat: (text.trim().length > 0)
    });
  }

  private onIndentChanged(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({
      indentSpaces: +(e.currentTarget.value)
    });
  }

  private reformat(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    // parse and re-format the json
    try {
      const o = JSON.parse(this.state.text);
      const text = JSON.stringify(o, null, this.state.indentSpaces);
      this.setState({text: text});
    }
    catch (e) {
      // emit the error so the view can listen for it
      this.errorSubject.next(e);
    }
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<JsonState>, snapshot?: any): void {
    const current = this.textElementRef.current;
    const textChanged = prevState.text !== this.state.text;

    // if the text changes, resize the textarea to fit it
    if (current && textChanged) {
      current.style.height = 'inherit';
      current.style.height = current.scrollHeight + 2 + 'px';
    }
  }

  render(): React.ReactNode {
    return (
      <Page title='JSON'>
        <ShakeablePanel title='Format JSON' shakeEventSource={this.error$}>
          <div>
            <textarea className={styles.text}
                      placeholder='Enter JSON string'
                      value={this.state.text}
                      onChange={(e) => this.onTextChanged(e)}
                      ref={this.textElementRef}
            />
          </div>
          <div>
            <input type='radio'
                   name='indentstyle'
                   id='indent2radio'
                   value='2'
                   checked={this.state.indentSpaces === 2}
                   onChange={(e) => this.onIndentChanged(e)}
            />&nbsp;
            <label htmlFor='indent2radio'>Indented</label>&nbsp;
            <input type='radio'
                   name='indentstyle'
                   id='indent0radio'
                   value='0'
                   checked={this.state.indentSpaces === 0}
                   onChange={(e) => this.onIndentChanged(e)}
            />&nbsp;
            <label htmlFor='indent0radio'>Compact</label>
          </div>
          <div>
            <button type='button'
                    disabled={!this.state.enableFormat}
                    onClick={(e) => this.reformat(e)}>
              Format
            </button>
          </div>
        </ShakeablePanel>
      </Page>
    );
  }
}

