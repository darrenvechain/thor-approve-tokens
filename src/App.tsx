import "./App.css";
import { useMemo, useState, useEffect } from "react";
import { useWallet, ConnectButtonWithModal } from "@vechain/dapp-kit-react";
import { useB3tr } from "./useB3tr";


const allowanceAbi = {
  constant: true,
  inputs: [
    {
      name: "owner",
      type: "address",
    },
    {
      name: "spender",
      type: "address",
    },
  ],
  name: "allowance",
  outputs: [
    {
      name: "",
      type: "uint256",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

function App() {
  const wallet = useWallet();

  const [contractAddress, setContractAddress] = useState<string>("");
  const [approveFor, setApproveFor] = useState<string>("");
  const [approveInputAmount, setApprovedInputAmount] = useState<string>("");
  const {approvedAmount, approveAmount} = useB3tr(contractAddress, approveFor);


  return (
    <>
      <div className="card">
        <ConnectButtonWithModal />

        {wallet.account && (
          <>
            <p>Enter B3tr Contract Address</p>
            <input
              value={contractAddress}
              onChange={(e) => {
                setContractAddress(e.target.value);
              }}
            ></input>

            <p>Enter address to approve (ask the airdrop dev)</p>
            <input
              value={approveFor}
              onChange={(e) => {
                setApproveFor(e.target.value);
              }}
            ></input>
          </>
        )}

        {
          approvedAmount && (
            <>
              <p>Approved Amount: {approvedAmount}</p>



              <p>Enter Amount to approve</p>
              <input
                type="number"
                onChange={(e) => {
                  setApprovedInputAmount(e.target.value);
                }}
              ></input>


              <button
                onClick={() => {
                  approveAmount(approveInputAmount);
                }}
              >
                Approve
              </button>
            </>
          )
        }
      </div>
    </>
  );
}

export default App;
