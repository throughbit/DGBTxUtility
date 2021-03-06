# sign.js

## Overview

sign.js is where transactions are signed.

It takes the following arguments:

* **inputs** : sender side details (sending address's utxo_set)
* **outputs** : receiver side details
* **fees** : provided by fees.js
* **change** : change = sum_of_utxos_balance - output_amount;
* **privatekey** : shhh
* **isMultiSig** : if = 1, control flow varies.

Ideally use the same sending address for change.

Utxo balance is calculated and checked whether it is above a given threshold. If not a notification is sent to refill the wallet.

Digibyte lib uses the following syntax for a regular transaction:

transaction.fee(fee).from(inputs).to({output.address,output.amount}).change(change).sign(pk);

.to() takes one output set at a time and is looped over for multiple outputs.

**If transaction isMultiSig**

transaction.from() requires an additional two arguments:
pubk_array: array of pubkeys that must sign the transaction
n: threhold i.e. number of signatories

Following output set being filled and transaction signed locally, transaction.toObject() is used to serialize the transaction and send it to the other signatories.

Refer to signatories.js to see how transaction is signed by tertiary signatory.

Upon receipt data is logged, transaction serialized and resolved to the client.

## Usage

          const signer = require('./sign');

          signer.sign_tx(inputs,outputs,fee,address,imported,isMultiSig)
          .then((hex)=>{
            resolve(hex);
          })
