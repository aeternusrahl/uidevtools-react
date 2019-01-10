import * as React from 'react';
import styles from './epochValue.module.scss';
import Clipboard from 'clipboard';

export interface EpochValueProps {
  label: string;
  value: string;
}

export interface EpochValueState {
  clipboardCopied: boolean;
}

export default class EpochValue extends React.Component<EpochValueProps, EpochValueState> {

  private readonly inputRef: React.RefObject<HTMLInputElement>;
  private clipboard: any;

  constructor(props: EpochValueProps) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      clipboardCopied: false
    };
  }

  componentDidMount(): void {
    if (this.inputRef.current) {
      this.clipboard = new Clipboard(this.inputRef.current);
      this.clipboard.on('success', () => {
        this.setState({clipboardCopied: true});
      });
    }
  }

  render(): React.ReactNode {
    const clickToCopyText = 'Click to copy to clipboard!';
    const clipboardClassName = this.state.clipboardCopied ? styles.clipboardCopied : '';
    return (
      <>
        <input ref={this.inputRef}
               type='text'
               readOnly
               className={styles.epochValue + ' ' + clipboardClassName}
               title={clickToCopyText}
               alt={clickToCopyText}
               data-clipboard-text={this.props.value}
               value={this.props.value}
               onAnimationEnd={() => this.setState({clipboardCopied: false})}
        />
        &nbsp;
        <span className={styles.epochLabel}>
          {this.props.label}
        </span>
      </>


    );
  }
}
