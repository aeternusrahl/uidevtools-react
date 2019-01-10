import * as React from 'react';
import styles from './home.module.scss';
import { Link } from 'react-router-dom';

interface DashLinkProps {
  title: string;
  subtitle: string;
  link: string;
}

class DashLink extends React.Component<DashLinkProps> {
  render(): React.ReactNode {
    return (
      <Link to={this.props.link} className={styles.dashLink}>
        <div className={styles.title}>{this.props.title}</div>
        <div className={styles.subtitle}>{this.props.subtitle}</div>
      </Link>
    );
  }
}


class Home extends React.Component {
  render(): React.ReactNode {
    return (
      <div className={styles.dashboard}>
        <DashLink title='Base 64' subtitle='Encode and decode base64 strings' link='base64' />
        <DashLink title='Epoch Time' subtitle='Convert to and from unix epoch time' link='/epoch-time'/>
        <DashLink title='JSON' subtitle='Format JSON text' link='json'/>
        <DashLink title='URI Encoding' subtitle='URI Encode and decode strings' link='uri'/>
      </div>
    );
  }
}

export default Home;
