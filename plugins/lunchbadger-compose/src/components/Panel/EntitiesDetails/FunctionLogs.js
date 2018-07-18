import React, {PureComponent} from 'react';
import cs from 'classnames';
import SLSService from '../../../services/SLSService';
import './FunctionLogs.scss';

export default class FunctionLogs extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logs: '',
    };
  }

  componentWillMount() {
    this.loadLogs();
  }

  loadLogs = async () => {
    this.setState({loading: true});
    const {body: {logs}} = await SLSService.loadLogs(this.props.name);
    this.setState({logs, loading: false});
  };

  render() {
    const {loading, logs} = this.state;
    return (
      <div className={cs('FunctionLogs', {loading})}>
        <pre>
          {logs}
        </pre>
      </div>
    );
  }
}
