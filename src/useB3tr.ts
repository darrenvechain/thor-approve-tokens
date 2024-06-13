import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { useEffect, useState } from "react";
import { abi } from 'thor-devkit'
import {ethers} from 'ethers';

const allowanceAbi: abi.Function.Definition = {
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
        name: "allowance",
        type: "uint256",
        },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
};

const approveAbi: abi.Function.Definition = {
    constant: false,
    inputs: [
        {
        name: "spender",
        type: "address",
        },
        {
        name: "value",
        type: "uint256",
        },
    ],
    name: "approve",
    outputs: [
        {
        name: "",
        type: "bool",
        },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
};


export const useB3tr = (contractAddress?: string, approveFor?: string) => {

    const wallet = useWallet();
    const {thor} = useConnex();
    const [approvedAmount, setApprovedAmount] = useState<string>("");

    const getAllowance = async () => {
        if (!contractAddress || !approveFor || !wallet.account) return;

        const res = await thor.account(contractAddress).method(allowanceAbi).call(wallet.account, approveFor);
        
        const thorAbi = new abi.Function(allowanceAbi);

        const decoded = thorAbi.decode(res.data);

        console.log(decoded);

        setApprovedAmount(ethers.formatEther(decoded.allowance.toString()));
    };

    const approveAmount = async (amount: string) => {
        if (!contractAddress || !approveFor || !wallet.account) return;

        const formattedAmount = ethers.parseEther(amount).toString();

        const res = await thor.account(contractAddress).method(approveAbi).transact(approveFor, formattedAmount).signer(wallet.account).request();
        
        console.log(res);

        // Get the new allowance after 10 seconds
        new Promise(resolve => setTimeout(resolve, 12000)).then(getAllowance)

        return res.txid;
    };

    useEffect(() => {
        console.log(contractAddress, approveFor, wallet.account)
        getAllowance();
    }, [contractAddress, approveFor, wallet.account]);

    return {
        approvedAmount,
        approveAmount,
    };
}