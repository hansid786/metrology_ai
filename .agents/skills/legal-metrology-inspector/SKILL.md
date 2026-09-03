---
name: legal-metrology-inspector
description: >-
  Expert skill for automated Legal Metrology inspection, packaging compliance audits,
  statutory verification (PCR 2011, FSSAI), mathematical USP discrepancy analysis,
  and Section 36(1) compounding fine calculations.
---

# Legal Metrology Inspector Skill

This skill equips Antigravity with deep statutory knowledge for Indian packaged commodities:

## Key Regulatory Frameworks
- **Legal Metrology (Packaged Commodities) Rules, 2011 (as amended 2021/2022)**
  - Rule 6(1)(a): Product Identity / Commodity Name
  - Rule 6(1)(b): Net Quantity in Standard Metric Units (g, kg, ml, L, Unit, NOS)
  - Rule 6(1)(c): Month & Year of Manufacture / Packing / Import & Best Before
  - Rule 6(1)(d): Name & Complete Address of Manufacturer / Packer / Importer with PIN Code
  - Rule 6(1)(e): Maximum Retail Price (MRP) inclusive of all taxes
  - Rule 6(1)(e) Amendment 2021: Unit Sale Price (USP) mandatory on all food/FMCG retail packages
  - Rule 6(1)(f): Consumer Care Contact Details (Phone + Email)
  - Rule 6(10): Country of Origin
- **Legal Metrology Act, 2009**
  - Section 36(1): Penalty for selling, distributing, delivering or manufacturing non-standard pre-packaged commodities.
  - Section 48: Compounding of offences.

## Audit Workflow
1. Parse raw image evidence using Triangulated Truth Consensus.
2. Evaluate 8 mandatory declarations.
3. Compute mathematical USP difference:
   $$\text{Diff } \% = \frac{\text{Printed USP} - \text{Calculated USP}}{\text{Calculated USP}} \times 100$$
4. Generate tamper-evident audit ledger with Section 65B Indian Evidence Act timestamping.
