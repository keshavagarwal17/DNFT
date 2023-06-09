import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { FaUsers } from 'react-icons/fa';
import { List, Space, Button, Modal, Form, Input, Alert, message } from 'antd';
import './Pools.css'
import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'antd/lib/form/Form';
import {GetAccount, bananaInstance} from '../../../hooks/GetAccount'
import GetContract from '../../../hooks/GetContract';
import FundsManagerContractArtifact from '../../../Ethereum/FundsManager.json'
import { ethers } from 'ethers';
import addresses from '../../../config';
import { Link } from 'react-router-dom';
import FakeItTokenContractArtifact from '../../../Ethereum/FakeIt.json'
import Axios from 'axios'
import Loader from '../../../shared/Loader/Loader';


const Pools = () => {
  const [isVis, setVis] = useState(false);
  const [form] = useForm();
  const [userPools, setUserPools] = useState([]);
  const [funds, setFunds] = useState(0);
  const [currentPoolId, setCurrentPoolId] = useState('');
  const [loadStatus, setLoadStatus] = useState(false);
  const [address,setAddress] = useState('');
  const [contract,setContract] = useState();
  const [provider,setProvider] = useState();
  const [isConsComp, setConsComp] = useState(false);

  const isUserPool = async (pool,cont,add) => {
    try {
      console.log(" this is pool info ", pool);
      let poolOwners = await cont.getPoolOwners(pool.poolId);
      console.log(" theses are pool owners and address ", poolOwners);
      console.log("this is owner address", add);
      let final = poolOwners.filter((owner) => owner === add);
      console.log(" these is user address ", final);
      return final.length > 0;
    } catch (err) {
      console.log(err.message);
    }
  }

  const getImageUrl = async (collectionAddress, tokenId) => {
    try {
      const aaSigner = provider.getSigner();
      let contractInstance = new ethers.Contract(collectionAddress, FakeItTokenContractArtifact.abi, aaSigner);
      // console.log(" this is called ");
      console.log(" this is token id and instance ", tokenId +"     " + contractInstance + "    " + collectionAddress);
      let imageUrl = await contractInstance.tokenURI(tokenId);
      console.log(" this is image url ", imageUrl);
      let getNFTMetaData = await Axios.get(imageUrl);
      console.log("nft meta data ", getNFTMetaData.data.uri);
      return getNFTMetaData.data.uri;
    } catch (err) {
      console.log(" this is err message ", err.message);
    }
  }

  const getUserPools = async () => {
    let add = await GetAccount();
    console.log("hey there ", add.length);
    if(add == undefined){
      console.log("in if");
      await getUserPools();
      return;
    }
    setAddress(add);
    const cont = await GetContract(addresses.fundsManager, FundsManagerContractArtifact.abi);
    setContract(cont);
    const aaProvider = await bananaInstance.getAAProvider(add);
    setProvider(aaProvider);
    try {
      setLoadStatus(true);
      let userPoolIds = await cont.getUserPools();
      console.log(" this are user pool ids ", userPoolIds);
      let allUserPools = [];
      for (let i = 0; i < userPoolIds.length; i++) {
        let pool = await cont.pools(userPoolIds[i]);
        if (await isUserPool(pool,cont,add)) {
          allUserPools.push({
            goal: parseInt(pool.fundGoal._hex) / 10 ** 18,
            funds: parseInt(pool.funds._hex) / 10 ** 18,
            negate: parseInt(pool.negativeCount._hex),
            positive: parseInt(pool.positiveCount._hex),
            name: pool.poolName,
            size: parseInt(pool.poolSize._hex),
            poolId: pool.poolId,
            collectionAddress: pool.collectionAddress,
            tokenId: parseInt(pool.tokenId._hex),
            imageUrl: await getImageUrl(pool.collectionAddress, pool.tokenId)
          })
        }
      }
      console.log(" this is all user pools ", allUserPools);
      setUserPools(allUserPools);
      setLoadStatus(false);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getUserPools();
  },[])

  const addFunds = () => {
    setVis(false);
  }

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  // setCurrentPoolId(poolId)  
  const ActionButton = ({ text, type, onClick, className }) => (
    <Button type={type} onClick={onClick} className={className} >
      {text}
    </Button>
  )

  const contributeFundsToPool = async () => {
    try {
      setLoadStatus(true);
      console.log(" this is current pool id ", currentPoolId);
      const greetCallData = contract.interface.encodeFunctionData(
        "contributeFunds",
         [currentPoolId]
      )
      const txn = await bananaInstance.execute(greetCallData, addresses.fundsManager, funds);
      // let contributeTxn = await contract.contributeFunds(currentPoolId, { value: ethers.utils.parseEther(funds) });
      // await contributeTxn.wait();
      setVis(false);
      getUserPools();
      setLoadStatus(false);
      message.success("Contribution to pool done successfully ");
    } catch (err) {
      console.log(err.message);
    }
  }

  const makeConsensus = async (poolId, isAgree) => {
    try {
      setLoadStatus(true);
      setVoted(true);
      setConsComp(true);
      let isUserVoted = await contract.isVoted(poolId);
      console.log("User Voted ", isUserVoted);
      if(!isUserVoted) {
        const greetCallData = contract.interface.encodeFunctionData(
          "makeConsensus",
           [poolId,isAgree]
        )
        const txn = await bananaInstance.execute(greetCallData, addresses.fundsManager, "0");
        // let consensusTxn = await contract.makeConsensus(poolId, isAgree, { gasLimit: 9000000 });
        // await consensusTxn.wait();
        getUserPools();
        setLoadStatus(false);
        message.success("Vote counted successfully");
      } else {
        setLoadStatus(false);
        message.error("You already voted to pool");
      }
    } catch (err) {
      console.log(err.message);
      message.error("You are not allowed to vote");
    }
  }
//! Don't know why the imageUrl is not getting updated while rendering


  const [isConsLive, setConsLive] = useState(false);
  const [isVoted, setVoted] = useState(false);

  const data = Array.from({
    length: 23,
  }).map((_, i) => ({
    poolId: i,
    name: `ant design part ${i}`,
    funds: 11,
    goal: 10,
    size: i,
  }));

  return (
    loadStatus ? <Loader /> :
    <div className='pools-div'>
      <div className='pools-list-par'>
        <h1 className='pools-heading'>Your Pools</h1>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={userPools}
          renderItem={(item) => (
            <List.Item
              key={item.poolId}
              actions={[
                <IconText icon={FaUsers} text={item.size} key="list-vertical-users-o" />,
                <ActionButton text={'Add Funds'} type='primary' onClick={() => { setVis(true); setCurrentPoolId(item.poolId) }} />,
                // !isConsLive && <ActionButton text={'Start Consensus'} type='primary' onClick={()=>setConsLive(true)} />,
                (item.funds >= item.goal ) ? <h4 className='pc-consensus-ques'>Do you wanna support buying ? </h4> : '',
                (item.funds >= item.goal ) ? <ActionButton text={'Yes'} className={'pool-success-btn'} type='success' onClick={() => makeConsensus(item.poolId, true)} /> : null,
                (item.funds >= item.goal ) ? <ActionButton text={'No'} type='danger' onClick={() => makeConsensus(item.poolId, false)} /> : null,
                (item.funds >= item.goal) ? <h4 className='pc-consensus-data'>Voted Yes : {item.positive} </h4> : '',
                (item.funds >= item.goal) ? <h4 className='pc-consensus-data'>Voted No : {item.negate} </h4> : '',
              ]}
              extra={
                <img
                  width={272}
                  height={180}
                  alt="logo"
                  src={item.imageUrl}
                />
              }
            >
              {
                ((item.positive + item.negate) === item.size) && <Alert className='pc-alert' message={'Consensus is completed'} type='success' showIcon />
              }
              <List.Item.Meta
                title={<Link className='pc-heading' to={`/pools/${item.poolId}`}>{item.name}</Link>}
                />
              {item.funds + ' ETH / ' + item.goal + ' ETH'}
            </List.Item>
          )}
        />
        <Modal 
          title="Add Funds"
          className='add-funds-modal'
          visible={isVis}
          onOk={() => contributeFundsToPool()}
          onCancel={() => { setCurrentPoolId(''); setVis(false) }}
        >
          <Form className='addfunds-modal-form' form={form} layout="vertical">
            <Form.Item>
              <Input 
                type="number" 
                min="0.000000000000000001"
                placeholder="Enter amount in ETH"
                step="0.000000000000000001" 
                onChange={(e) => setFunds(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default Pools