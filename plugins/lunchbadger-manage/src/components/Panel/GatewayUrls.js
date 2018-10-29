import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {EntityPropertyLabel, DocsLink} from '../../../../lunchbadger-ui/src';

class GatewayUrls extends PureComponent {
  render() {
    const {gateways} = this.props;
    const gatewayUrls = Object.values(gateways)
      .filter(({loaded, deleting}) => loaded && !deleting)
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map(({rootUrl}) => rootUrl);
    return (
      <div className="details-panel__element">
        <div className="details-panel__fieldset">
          <EntityPropertyLabel>
            Gateway URLs
            <DocsLink item="SETTINGS_GATEWAY_URLS" />
          </EntityPropertyLabel>
          {gatewayUrls.length === 0 && (
            <label className="details-panel__label">
              No gateway has been deployed yet.
            </label>
          )}
          {gatewayUrls.length > 0 && (
            <div className="details-panel__static-field">
              {gatewayUrls.map(url => (
                <div key={url}>
                  <a href={url} target="_blank">{url}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const selector = createSelector(
  state => state.entities.gateways,
  gateways => ({gateways}),
);

export default connect(selector)(GatewayUrls);
