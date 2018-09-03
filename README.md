# Onionful API

## AWS Secrets Manager

Required **Secrets**:

**development/onionful**

```
{
  "auth0": {
    "domain": "domain.auth0.com",
    "clientId": "...",
    "jwksUri": "https://onionful.eu.auth0.com/.well-known/jwks.json",
    "api": {
      "clientId": "...",
      "clientSecret": "..."
    }
  }
}
```

**development/onionful/token**

```
{
  "token": "..."
}
```
