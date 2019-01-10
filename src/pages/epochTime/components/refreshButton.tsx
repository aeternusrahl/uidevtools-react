import * as React from 'react';
import './refreshButton.module.scss';

export interface RefreshButtonProps {
  onRefresh: () => void;
}

export interface RefreshButtonState {
  refreshing: boolean;
}

export default class RefreshButton extends React.Component<RefreshButtonProps, RefreshButtonState> {

  constructor(props: RefreshButtonProps) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  private onClicked(e: React.MouseEvent): void {
    e.preventDefault();
    this.props.onRefresh();

    // start animating
    this.setState({refreshing: true});
  }

  private onAnimationEnd(): void {
    this.setState({refreshing: false});
  }

  render(): React.ReactNode {
    return (
      <a href='#'
         className={`fa fa-refresh ${this.state.refreshing ? 'refreshing' : ''}`}
         onClick={(e) => this.onClicked(e)}
         onAnimationEnd={() => this.onAnimationEnd()}

      />
    );
  }
}
