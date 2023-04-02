import React,{useState, useEffect} from 'react'
import './Navbar.css'
import { Menu, Button, Modal, Input,message } from 'antd';
import { ClusterOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import {GetAccount,bananaInstance} from '../../hooks/GetAccount';
import { ethers } from 'ethers';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [address,setAddress] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkWallet = async()=>{
      const account = await GetAccount();
      if(account){
        setAddress(account);
      }
  }

  useEffect(()=>{
      checkWallet();
  },[])

  const trim = (address) =>{
      return address.substr(0,3) + "..." + address.substr(address.length - 3,3);
  }

  const createWallet = async()=>{
    const isUnique = await bananaInstance.isWalletNameUnique(walletName);
    if(isUnique){
      const walletResponse = await bananaInstance.getWalletAddress(walletName);
      const walletAddress = walletResponse;
      console.log("Smart contract wallet", walletAddress);
      const isValidAddress = ethers.utils.isAddress(walletAddress);
      if(isValidAddress){
        setAddress(walletAddress);
        handleCancel();
      }else{
        message.error("Something Went Wrong! Please Try Again");  
      }
    }else{
      message.error("The Wallet Name you entered is already taken! Please try another one");
    }
  }

  // contract(signer)

  return (
    <div className='nav-div'>
        <Menu className='navbar' mode="horizontal" theme='dark'>
            <div className='nav-logo-div'>
                <ClusterOutlined className='nav-logo' />
                <span className='logo-heading'>
                    DNFT
                </span>
            </div>
            <div className='navbar-btn-div'>
                {address ? 
                <Button>
                   {trim(address)}
                </Button>:
                <Button className='nav-btn' onClick={showModal}>
                    Connect Wallet
                </Button>
                }
                <Modal title="Create Your Wallet" visible={isModalOpen} onCancel={handleCancel} footer={null}>
                  <Input onChange={(e)=>setWalletName(e.target.value)} placeholder="Enter a Unique Wallet Name" className='wallet-name-input'/>
                  <Button onClick={createWallet}>Create Wallet</Button>
                </Modal>
            </div>
            
        </Menu>
    </div>
  )
}

export default Navbar