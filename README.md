# DGBTxUtility
Digibyte utitlity for signing and broadcasting transactions to an external node. 

## Test Control Flow:

**curl -X POST "http://localhost:$L_PORT/test_send"**

### **TxRequestListener.js** 
listens for requests from a  client to create a transaction. 

In this test case - the client is the system making the above curl request. 

For production, the request will require passing **transaction outputs** i.e. (to_address:amount) which is parsed by **build-tx-outputs.js**. This is currently hard coded as a variable "__outputs__" for testing therefore build-tx-outputs.js is not being used currently.
When recieving the test_send curl request, the hard-coded outputs are passed to broadcast_tx from build-tx-complete.js. 

### **build-tx-complete.js** 
provides DGB Key services. contains two functions:
    
   - broadcast_tx(): first calls build_TxInputs() from **build-tx-inputs.js** to generate **transaction inputs**. 
                     build_TxInputs() makes a request to our remote node interface calling endpoint /get_utxo. 
                     the result is then parsed into the format required by digibyte-lib as **inputs**
                     once fetched and formatted __inputs__ are resolved .then(sign_tx()) is called.
   - sign_tx(inputs, outputs, fee, change, pk): signs transactions using inputs and outputs fetched via requests. Fee change and pk are hardcoded global/env variables. 
    
No requests are made within sign_tx() in order to isolate the module that performs operations using the pk from modules.
This removes concerns about dodgy async behaviour affecting any critical pk related operations. 
More checks required within sign_tx() to ensure inputs and outputs are correctly formatted and verified before signing. 

After sign_tx() resolves a __tx_hex__, control flows back to broadcast_tx which .then() passes the hex to broadcast_to_node() from Broadcaster.js.

### **Broadcaster.js** 
connects to a remote node and provides a raw tx-hex to the sendrawtransaction function. 

resolves a __txid__ upon success and passes it back to broadcast_tx from build-tx-complete.

upon receipt of a __txid__ broadcast_tx() will resolve back to the TxRequestListener Server at L_PORT which can then respond back to  the client with a __txid__ of the successful transaction.

### Notes:
- Transactions must only be made with a time interval of 6 blocks since UTxO's are hard-coded to only be spendable after 6 confirmations. This equates to ~1.5 minutes. This can be changed by adjusting the minconf value in the express endpoint for listunspent in the NodeServer.js from BTCServices.

### UPGRADES:
- Accept tx_ouputs from client.
- Check if inputs and outputs are in the correct format at sign_tx()
- Error handling
