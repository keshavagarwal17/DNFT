import React from 'react';
import { useSigner, useContract } from 'wagmi';
import { GetAccount,bananaInstance } from './GetAccount';
import { ethers } from 'ethers';

const GetContract = async(addr, abidata) => {
  const walletAddress = await GetAccount();
  console.log(walletAddress);
  const aaProvider = await bananaInstance.getAAProvider(walletAddress);

  // extracting aaSigner
  const aaSigner = aaProvider.getSigner();

  const contract = new ethers.Contract(
    addr,
    abidata,
    aaSigner
   );
  return contract;
}

export default GetContract;