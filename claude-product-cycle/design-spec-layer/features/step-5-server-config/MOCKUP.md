# Step 5: Server Configuration - Mockups

---

## Mobile View

```
┌─────────────────────────────────────────┐
│  ← Back    MifosLaunchpad    Step 5 of 10  │
├─────────────────────────────────────────┤
│  ○ ○ ○ ○ ● ○ ○ ○ ○ ○                   │
│                                         │
│  Server Configuration                   │
│  Configure API endpoints                │
│                                         │
│  [Development] [Staging] [Production]   │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Development Environment            ││
│  │                                     ││
│  │  Protocol:  [HTTPS ▼]               ││
│  │                                     ││
│  │  Base URL:                          ││
│  │  [dev.mifos.org______________]      ││
│  │                                     ││
│  │  API Path:                          ││
│  │  [/fineract-provider/api/v1__]      ││
│  │                                     ││
│  │  Port:      Tenant ID:              ││
│  │  [443___]   [default__________]     ││
│  │                                     ││
│  │  [Test Connection]        ✓ OK      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Connection Settings                ││
│  │                                     ││
│  │  Connection Timeout: 30s            ││
│  │  [────────●────────]                ││
│  │                                     ││
│  │  Read Timeout: 30s                  ││
│  │  [────────●────────]                ││
│  │                                     ││
│  │  Certificate Pinning  [    ]        ││
│  │  Offline Mode         [    ]        ││
│  └─────────────────────────────────────┘│
│                                         │
├─────────────────────────────────────────┤
│  [← Previous]              [Next Step →]│
└─────────────────────────────────────────┘
```

---

## Desktop View

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ← Back           MifosLaunchpad                            Step 5 of 10      │
├────────────────────────────────────────────────────────────────────────────┤
├─────────────────────────────────────────────┬──────────────────────────────┤
│                                             │                              │
│  Server Configuration                       │  Connection Status           │
│                                             │                              │
│  [Development] [Staging] [Production]       │  Development: ✓ Connected    │
│                                             │  Staging: ○ Not tested       │
│  ┌─────────────────────────────────────────┐│  Production: ○ Not tested    │
│  │  Development Environment                ││                              │
│  │                                         ││  Response Times:             │
│  │  Protocol   Base URL                    ││  Dev: 245ms                  │
│  │  [HTTPS▼]   [dev.mifos.org_________]   ││                              │
│  │                                         ││                              │
│  │  API Path                               ││                              │
│  │  [/fineract-provider/api/v1________]   ││                              │
│  │                                         ││                              │
│  │  Port       Tenant ID                   ││                              │
│  │  [443]      [default_______________]   ││                              │
│  │                                         ││                              │
│  │  [Test Connection]                      ││                              │
│  └─────────────────────────────────────────┘│                              │
│                                             │                              │
│  Connection Settings                        │                              │
│  Timeout: 30s  [──●──]                     │                              │
│  Cert Pinning: [ ]  Offline: [ ]           │                              │
│                                             │                              │
├─────────────────────────────────────────────┴──────────────────────────────┤
│  [← Previous]                                              [Next Step →]   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Connection Test States

```
Testing:   [Test Connection]  ⟳ Testing...
Success:   [Test Connection]  ✓ Connected (245ms)
Failed:    [Test Connection]  ✗ Connection failed
```
