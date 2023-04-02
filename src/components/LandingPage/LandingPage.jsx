import { Button, message } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import React from 'react'
import Navbar from '../../shared/Navbar/Navbar'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom'
import {GetAccount} from '../../hooks/GetAccount'

const LandingPage = () => {
  const navigate = useNavigate();
  
  const checkIsWalletConnect = async() => {
    let account =  await GetAccount();
    if(account) {
      navigate("/create-pool");
    } else {
      message.error("Please connect your wallet first !");
    }
  }

  return (
    <div className="lp-bg-div">
      <div className='lp-row1'>
        
        <div className='lp-illus-div'>
          <img className='lp-illus' src={'https://informationage-staging.s3.amazonaws.com/uploads/2022/10/nft-use-cases-for-businesses.jpeg'} alt={'illust.png'} />
        </div>
        <div className='lp-heading-div'>
          <h1 className='lp-heading'>Buy NFT <br /> For Your Group.</h1>
        </div>
      </div>
      <div className='lp-row2'>
        <Button size='large' type='primary' className='lp-button' onClick={checkIsWalletConnect}>
          <span className='lp-button-text'>Let's Go</span>
          <RightOutlined className='lp-button-icon' />
        </Button>
      </div>
    </div>
  )
}

export default LandingPage