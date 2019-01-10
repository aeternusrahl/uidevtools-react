import * as React from 'react';
import styles from './page.module.scss';
import { Link } from 'react-router-dom';


interface PageHeaderProps {
  title: string;
}

class PageHeader extends React.Component<PageHeaderProps> {
  render(): React.ReactNode {
    return (
      <div className={styles.header}>
        <Link to='/' className={styles.backButton} title='Back to dashboard'>&lt;<span className={styles.backText}> BACK</span></Link>
        <span className={styles.title}>{this.props.title}</span>
      </div>
    );
  }
}


interface PageProps {
  title: string;
}

export default class Page extends React.Component<PageProps> {
  render(): React.ReactNode {
    return (
      <>
        <PageHeader title={this.props.title}/>
        <div className={styles.content} >
          {this.props.children}
        </div>
      </>
    );
  }
}
