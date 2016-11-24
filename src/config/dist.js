export default {
  configStoreApiUrl: 'https://api.lunchbadger.com/api',
  projectApiUrl: 'http://{USER}-{ENV}.api.lunchbadger.com/api',
  workspaceApiUrl: 'http://{USER}-{ENV}.api.lunchbadger.com:81/api',
  forecastApiUrl: 'http://localhost:3000/api',
  oauth: {
    authority: 'https://www.lunchbadger.com',
    client_id: '4kzhU5LqlUpQJmjbMevWkWyt9adeKK',
    redirect_uri: 'https://app.lunchbadger.com',
    scope: 'openid profile email',
    metadata: {
      issuer: 'https://www.lunchbadger.com',
      authorization_endpoint: 'https://www.lunchbadger.com/oauth/authorize',
      userinfo_endpoint: 'https://www.lunchbadger.com/oauth/me'
    },
    signingKeys: [
      {
        'kid': 'main',
        'kty': 'RSA',
        'n':'vfjNBl0-VTV3Bg9Yk5vb2U4jrnQ7E8zOerwmMJHd4T432CpUqdLIhCupbz3wjvnW4K3zSc23wB_DHjhvpPEjH40kFfeIBKetv0_aoC8yEpkMDoRHNxsj-PfAHGnZwuCIU9S9CpcDdfHlWzM8YlKxbhLymO3mMkWlwApa3ryAw_3WAZqxcvdRQGfh-9bDym5OOkjg9ygAtf1oBTrEeK88wjsm7LUBxQ_CYzUHEmuTK66UxLZZYt8xY6wJ9OE-ZQauPlgfS2c-kA2NZMFqVVSeEkNj7jjkVlLgL4bqAxYk60RxkWe_ROKyiTdZkEsQz0MCmtkxTdmWRfbn7CM6MuJmQw',
        'e':'AQAB'
      }
    ]
  },
  envId: 'dev'
};
