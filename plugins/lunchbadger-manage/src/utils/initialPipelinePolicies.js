import GATEWAY_POLICIES from './gatewayPolicies';

const {OAUTH2, RATE_LIMIT, LOG} = GATEWAY_POLICIES;

export default [
  {
    [OAUTH2]: [],
  },
  {
    [RATE_LIMIT]: [],
  },
  {
    [LOG]: [
      {
        action: {
          message: '${req.method} ${req.originalUrl}',
        }
      },
    ],
  },
];
