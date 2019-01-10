import * as React from 'react';
import Page from '../../components/page';
import styles from './base64.module.scss';
import { ShakeablePanel } from '../../components/shakeablePanel';
import { Subject } from 'rxjs';
import { animateToText } from '../../services/animateToText';
import { finalize } from 'rxjs/operators';

interface Base64State {
  text: string;
  enableButtons: boolean;

}

export default class Base64 extends React.Component<{}, Base64State> {

  private readonly textElementRef: React.RefObject<HTMLTextAreaElement>;
  private errorSubject = new Subject<any>();
  private error$ = this.errorSubject.asObservable();

  constructor(props: {}) {
    super(props);
    this.state = {
      text: '',
      enableButtons: false
    };

    this.textElementRef = React.createRef();
  }


  private onTextChanged(e: React.FormEvent<HTMLTextAreaElement>): void {
    const text = e.currentTarget.value;
    this.setState({
      text: text,
      enableButtons: (text.trim().length > 0)
    });
  }


  private encode(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    // parse and re-format the json
    try {
      const encodedText = btoa(encodeURIComponent(this.state.text).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      }));
      this.animateTextChange(encodedText);
    }
    catch (e) {
      // emit the error so the view can listen for it
      this.errorSubject.next(e);
    }
  }

  private decode(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    // parse and re-format the json
    try {
      const decodedText = decodeURIComponent(Array.prototype.map.call(atob(this.state.text), function (c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      this.animateTextChange(decodedText);
    }
    catch (e) {
      // emit the error so the view can listen for it
      this.errorSubject.next(e);
    }
  }

  private animateTextChange(newText: string): void {
    this.setState({enableButtons: false});

    animateToText(newText)
      .pipe(finalize(() => {
        this.setState({enableButtons: true});
      }))
      .subscribe((t) => {
        this.setState({text: t});
      });
  }


  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<Base64State>, snapshot?: any): void {
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
      <Page title='BASE 64'>
        <ShakeablePanel title='Encode / Decode Base64' shakeEventSource={this.error$}>
          <div>
            <textarea className={styles.text}
                      placeholder='Enter text to encode or decode'
                      value={this.state.text}
                      onChange={(e) => this.onTextChanged(e)}
                      ref={this.textElementRef}
            />
          </div>
          <div className={styles.buttonRow}>
            <button type='button'
                    disabled={!this.state.enableButtons}
                    onClick={(e) => this.encode(e)}>
              Encode
            </button>
            <button type='button'
                    disabled={!this.state.enableButtons}
                    onClick={(e) => this.decode(e)}>
              Decode
            </button>
          </div>
        </ShakeablePanel>
      </Page>
    );
  }
}

