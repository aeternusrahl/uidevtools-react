import * as React from 'react';
import styles from './panel.module.scss';

export interface PanelHeaderProps {
  title: string;
}

export interface PanelProps extends PanelHeaderProps {
  widget?: React.ReactNode;
}

export class PanelHeader extends React.Component<PanelHeaderProps> {

  render(): React.ReactNode {
    return (
      <div className={styles.header}><span className={styles.title}>{this.props.title}</span>{this.props.children}</div>
    );
  }
}

export class PanelBody extends React.Component {

  render(): React.ReactNode {
    return (
      <div className={styles.body}>
        {this.props.children}
      </div>
    );
  }
}

export class PanelRow extends React.Component {
  render(): React.ReactNode {
    return (
      <div className={styles.row}>
        {this.props.children}
      </div>
    );
  }
}

export default class Panel extends React.Component<PanelProps> {

  render(): React.ReactNode {
    return (
      <div className={styles.panel}>
        <PanelHeader title={this.props.title}>{this.props.widget}</PanelHeader>
        <PanelBody children={this.props.children}/>
      </div>
    );
  }
}

