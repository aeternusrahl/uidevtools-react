import * as React from 'react';
import { Observable, Subscription } from 'rxjs';
import styles from './shakeable.module.scss';

interface ShakeableProps {
  shakeEventSource: Observable<any>;
}

interface ShakeableState {
  shaking: boolean;
}

/**
 * HOC that will shake the inner component on events from an observable
 * @param InnerComponent
 */
export const shakeable = <P extends object>(InnerComponent: React.ComponentType<P>) => {
  return class ShakeableThing extends React.Component<P & ShakeableProps, ShakeableState> {

    sub?: Subscription;

    constructor(props: P & ShakeableProps) {
      super(props);
      this.state = {shaking: false} as ShakeableState;
    }

    componentDidMount(): void {
      this.subscribeToShakeEvents();
    }

    componentDidUpdate(prevProps: Readonly<P & ShakeableProps>, prevState: Readonly<ShakeableState>, snapshot?: any): void {
      // if event source is changing we'll need to update our subscription
      const newEventSource = this.props.shakeEventSource;
      const eventSourceChanged = prevProps.shakeEventSource !== newEventSource;
      if (eventSourceChanged) {
        this.unsubscribeShakeEvents();
        this.subscribeToShakeEvents();
      }
    }

    componentWillUnmount(): void {
      this.unsubscribeShakeEvents();
    }

    private subscribeToShakeEvents() {
      const eventSource = this.props.shakeEventSource;

      // subscribe to the new event source
      if (eventSource) {
        this.sub = eventSource.subscribe(() => this.onShakeEvent(true));
      }
    }

    private unsubscribeShakeEvents() {
      if (this.sub) {
        this.sub.unsubscribe();
        this.sub = undefined;
      }
    }

    private onShakeEvent(shouldShake: boolean): void {
      const newState = { shaking: shouldShake } as ShakeableState;
      this.setState(newState); // smh
    }

    render(): React.ReactNode {
      const {shakeEventSource, ...props} = this.props;
      const state = this.state as ShakeableState;
      return (
        <div className={state.shaking ? styles.shakeElement : undefined}
             onAnimationEnd={() => this.onShakeEvent(false)}>
          <InnerComponent {...props as P} />
        </div>
      );
    }
  };
};

