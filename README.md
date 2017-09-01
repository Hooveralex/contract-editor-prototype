# Contract Editor Prototype

## Overview
[ContractStandards](https://www.contractstandards.com) is a site for attorneys in need of contract language. It is a free reference resource that lawyers can use to get standardized contract and clause language, along with relevant research, case law, etc.

We use machine learning tools to analyze real-world contract language and generate “market standard” language from that analysis. We also offer customizable libraries to enterprise clients.

The way we manage both private and public content is through a system of linked clauses and contracts. Our platform treats clauses as modular Lego pieces that can be assembled in a variety of ways to create new contracts. Our model borrows heavily from similar concepts in software development and design.

## What this prototype is testing
This prototype is designed to test the following interactions:
1. Sync an empty clause block in the contract with clause content from the clause library.
2. From the contract editor view, edit a clause and publish changes. Changes will be reflected in the contract and synced clause.
3. Navigate contract using contract outline.
4. Get an overview of each clause block's status (i.e., synced with clause library, unsynced, and synced with changes to clause pending)
5. Basic text editor functions: auto numbering, tab and shift + tab to indent/outdent

