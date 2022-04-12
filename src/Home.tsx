import { useEffect, useMemo, useState, useCallback } from 'react';
import * as anchor from '@project-serum/anchor';

import styled from 'styled-components';
import { Container, Snackbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from './candy-machine';
import { AlertState } from './utils';
import { Header } from './Header';
import { MintButton } from './MintButton';
import { GatewayProvider } from '@civic/solana-gateway-react';

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection,
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
  }, [anchorWallet, props.candyMachineId, props.connection]);

  const onMint = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true,
          );
        }

        if (status && !status.err) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error',
      });
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  return (
      <div>
        <div className="small-bros">
          <div style={{backgroundColor: '#2e2278',color: '#fff',zIndex: '999999999999',fontSize: '50px'}} id="loader">
            Loading ...
          </div>
          <header>
            <div className="header-content">
              <div className="header-left">
                <a
                    href="https://www.instagram.com/cafe4am/?hl=es"
                    target="_blank"
                >
                  <img src="assets/img/layer-1/svg/instagram.svg" alt="instagram"/>
                </a>
                <a href="https://www.facebook.com/micafe4am/" target="_blank">
                  <img src="assets/img/layer-1/svg/twitter.svg" alt="FaceBook"/>
                </a>
                <a href="https://www.tripadvisor.com.mx/Restaurant_Review-g150811-d23205138-Reviews-Cafe_4AM-Merida_Yucatan_Peninsula.html"
                   target="_blank">
                  <img src="assets/img/layer-1/svg/medium.svg" alt="TripAdvisor"/>
                </a>
              </div>
              <div className="header-right">
                <a className="babydoll" href="#">HOME</a>
                <a className="babydoll" href="#">Coffee Punks</a>
                <a className="babydoll" href="#traits">TRAITS</a>
                <a className="babydoll" href="#team-container">TEAM</a>
                <a className="babydoll" href="#roadmap">ROADMAP</a>
                <a className="babydoll" href="#faq">FAQ</a>
                <a className="babydoll" href="#">MINT</a>
              </div>
              <div className="header-mob-icons">
                <img
                    className="menu"
                    src="assets/img/layer-1/svg/menu.svg"
                    alt="menu"
                />
                <img
                    className="clear"
                    src="assets/img/layer-1/svg/clear.svg"
                    alt="clear"
                />
              </div>
              <div className="header-mob">
                <main>
                  <a className="babydoll" href="#">HOME</a>
                  <a className="babydoll" href="#">Coffee Punks</a>
                  <a className="babydoll" href="#traits">TRAITS</a>
                  <a className="babydoll" href="#team-container">TEAM</a>
                  <a className="babydoll" href="#roadmap">ROADMAP</a>
                  <a className="babydoll" href="#faq">FAQ</a>
                  <a className="babydoll" href="#">MINT</a>
                </main>
              </div>
            </div>
          </header>
          <section className="layer-1">
            <img
                className="layer-1-bg"
                src="assets/img/layer-1/svg/layer-1-bg.svg"
                alt="layer-1-bg"
            />
            <img
                className="l1-tree"
                src="assets/img/layer-1/svg/l1-tree.svg"
                alt="l1-tree"
            />
            <img
                className="mountain-left"
                src="assets/img/layer-1/svg/mountain-left.svg"
                alt="mountain-left"
            />
            <img
                className="mountain-right"
                src="assets/img/layer-1/svg/mountain-right.svg"
                alt="mountain-right"
            />
            <img
                className="rainbow"
                src="assets/img/layer-1/svg/rainbow.svg"
                alt="rainbow"
            />
            <img className="l1-sun" src="assets/img/layer-1/svg/sun.svg" alt="sun"/>
            <img
                className="cloud-1"
                src="assets/img/layer-1/svg/cloud-right.svg"
                alt="cloud-1"
            />
            <img
                className="cloud-2"
                src="assets/img/layer-1/svg/cloud-left.svg"
                alt="cloud-2"
            />
            <img
                className="cloud-3"
                src="assets/img/layer-1/svg/cloud-right.svg"
                alt="cloud-3"
            />
            <img
                className="sb-logo"
                src="assets/img/layer-1/svg/sb-logo.svg"
                alt="sb-logo"
            />
            <video width="400" controls className="sb-video">
              <source src="assets/video/demo_video.mp4" type="video/mp4"/>
                <source src="assets/video/demo_video.mp4" type="video/ogg"/>
                  Your browser does not support HTML video.
            </video>
            <p className="sb-text text-white">The first coffee shop NFT collection in the world that delivers amazing
              benefits to its
              holders
              both local and world-wide.
            </p>
            <div className="mint">
              <h1 className="sb-mint">
                <Container style={{ width: '500px',height: '100px' }}>
                  <Container maxWidth="xs" style={{ position: 'relative' }}>
                    <Paper
                        style={{ padding: 24, backgroundColor: '#151A1F', borderRadius: 6 }}
                    >
                      {!wallet.connected ? (
                          <ConnectButton>Connect Wallet</ConnectButton>
                      ) : (
                          <>
                            <Header candyMachine={candyMachine} />
                            <MintContainer>
                              {candyMachine?.state.isActive &&
                              candyMachine?.state.gatekeeper &&
                              wallet.publicKey &&
                              wallet.signTransaction ? (
                                  <GatewayProvider
                                      wallet={{
                                        publicKey:
                                            wallet.publicKey ||
                                            new PublicKey(CANDY_MACHINE_PROGRAM),
                                        //@ts-ignore
                                        signTransaction: wallet.signTransaction,
                                      }}
                                      gatekeeperNetwork={
                                        candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                                      }
                                      clusterUrl={rpcUrl}
                                      options={{ autoShowModal: false }}
                                  >
                                    <MintButton
                                        candyMachine={candyMachine}
                                        isMinting={isUserMinting}
                                        onMint={onMint}
                                    />
                                  </GatewayProvider>
                              ) : (
                                  <MintButton
                                      candyMachine={candyMachine}
                                      isMinting={isUserMinting}
                                      onMint={onMint}
                                  />
                              )}
                            </MintContainer>
                          </>
                      )}
                    </Paper>
                  </Container>

                  <Snackbar
                      open={alertState.open}
                      autoHideDuration={6000}
                      onClose={() => setAlertState({ ...alertState, open: false })}
                  >
                    <Alert
                        onClose={() => setAlertState({ ...alertState, open: false })}
                        severity={alertState.severity}
                    >
                      {alertState.message}
                    </Alert>
                  </Snackbar>
                </Container>
              </h1>
            </div>

          </section>
          <section className="layer-2">
            <img
                className="layer-2-bg"
                src="assets/img/layer-2/svg/layer-2-bg.svg"
                alt="layer-2-bg"
            />
            <img
                className="layer-2-border-bottom"
                src="assets/img/layer-2/svg/border-bottom.svg"
                alt="layer-2-border-bottom"
            />
            <img
                className="bros-3"
                src="assets/img/layer-2/svg/bros-3.svg"
                alt="bros-3"
            />
            <img
                className="bush-left"
                src="assets/img/layer-1/svg/bush-left.svg"
                alt="bush-left"
            />
            <img
                className="bush-right"
                src="assets/img/layer-1/svg/bush-right.svg"
                alt="bush-right"
            />
            <div className="grass-nft-box">
              <p className="coffee_punks">Café 4AM is a Mexican owned and operated specialty coffee family. Our main
                store is
                in the
                beautiful city of Mérida Yucatán México (close to Cancún and Chichen Itza) and our love for
                the ritual of coffee, the connections it creates and the community that grows around a local,
                loving coffee shop is eternal.<br/>So obviously, we felt the same way about the Web 3.0 family and
                  community
              </p>
              <img
                  className="grass-nft-1"
                  src="assets/img/layer-2/svg/grass-nft-1.svg"
                  alt="grass-nft-1"
                  loading="lazy"
              />
              <img
                  className="grass-nft-2"
                  src="assets/img/layer-2/svg/grass-nft-2.svg"
                  alt="grass-nft-2"
                  loading="lazy"
              />
              <img
                  className="grass-nft-3"
                  src="assets/img/layer-2/svg/grass-nft-3.svg"
                  alt="grass-nft-3"
                  loading="lazy"
              />
              <img
                  className="grass-nft-4"
                  src="assets/img/layer-2/svg/grass-nft-4.svg"
                  alt="grass-nft-4"
                  loading="lazy"
              />
              <img
                  className="grass-nft-5"
                  src="assets/img/layer-2/svg/grass-nft-5.svg"
                  alt="grass-nft-5"
                  loading="lazy"
              />
              <img
                  className="grass-nft-6"
                  src="assets/img/layer-2/svg/grass-nft-6.svg"
                  alt="grass-nft-6"
                  loading="lazy"
              />
              <img
                  className="grass-nft-7"
                  src="assets/img/layer-2/svg/grass-nft-7.svg"
                  alt="grass-nft-7"
                  loading="lazy"
              />
            </div>
          </section>
          <section className="layer-3" id="traits">
            <img
                className="layer-3-bg"
                src="assets/img/layer-3/svg/layer-3-bg.svg"
                alt="layer-3-bg"
                loading="lazy"
            />
            <div className="layer-3-wrapper">
              <img
                  className="l3-tree"
                  src="assets/img/layer-3/svg/l3-tree.svg"
                  alt="l3-tree"
                  loading="lazy"
              />
              <img
                  className="l3-sun"
                  src="assets/img/layer-1/svg/sun.svg"
                  alt="sun"
                  loading="lazy"
              />

              <img
                  className="cloud-1 cloud-1-l3"
                  src="assets/img/layer-1/svg/cloud-right.svg"
                  alt="cloud-1"
                  loading="lazy"
              />

              <img
                  className="cloud-3 cloud-1-l3"
                  src="assets/img/layer-1/svg/cloud-right.svg"
                  alt="cloud-3"
                  loading="lazy"
              />


              <div className="layer-4-text-box">
                <img
                    className="who-are-sb"
                    src="assets/img/layer-3/svg/who-are-sb.svg"
                    alt="who-are-sb"
                    loading="lazy"
                />
                <p className="babydoll text-white">
                  4AM Coffee Punks are our original NFT collection consisting of 400 beautiful pixel art,
                  crypto-punk inspired, Coffee Punks living in the Solana blockchain.
                  We will be releasing 100 Coffee Punks per coffee shop and our holders will receive amazing
                  caffeinated in-store benefits and incredible on-line surprises as well.

                </p>
              </div>
              <img
                  className="animated-nft"
                  src="assets/img/layer-3/svg/animated-nft.svg"
                  alt="animated-nft"
                  loading="lazy"
              />
            </div>
            <div className="layer-3-padding-bottom"></div>
          </section>
          <section className="layer-4" id="roadmap">
            <img
                className="layer-3-bg-in-layer-4"
                src="assets/img/layer-3/svg/layer-3-bg.svg"
                alt="layer-3-bg"
                loading="lazy"
            />
            <img
                className="layer-4-bg"
                src="assets/img/layer-4/svg/layer-4-bg.svg"
                alt="layer-4-bg"
                loading="lazy"
            />
            <img
                className="fence-1"
                src="assets/img/layer-3/svg/fence-1.svg"
                alt="fence-1"
                loading="lazy"
            />
            <img
                className="fence-2"
                src="assets/img/layer-3/svg/fence-2.svg"
                alt="fence-2"
                loading="lazy"
            />
            <img
                className="birds"
                src="assets/img/layer-4/svg/birds.svg"
                alt="birds"
                loading="lazy"
            />
            <img
                className="bird-1"
                src="assets/img/layer-4/svg/bird-1.svg"
                alt="bird-1"
                loading="lazy"
            />
            <img
                className="bird-2"
                src="assets/img/layer-4/svg/bird-2.svg"
                alt="bird-2"
                loading="lazy"
            />
            <img
                className="palm-tree-left"
                src="assets/img/layer-4/svg/palm-tree-left.svg"
                alt="palm-tree-left"
                loading="lazy"
            />
            <img
                className="palm-tree-right"
                src="assets/img/layer-4/svg/palm-tree-right.svg"
                alt="palm-tree-right"
                loading="lazy"
            />
            <div className="roadmap-track">
              <img
                  id="purple-bush"
                  src="assets/img/layer-4/svg/purple-bush.svg"
                  alt="purple-bush"
                  loading="lazy"
              />
              <img
                  className="roadmap-cloud"
                  src="assets/img/layer-4/svg/roadmap-cloud.svg"
                  alt="roadmap-cloud"
                  loading="lazy"
              />
              <img
                  className="road-back"
                  src="assets/img/layer-4/svg/road.svg"
                  alt="road"
                  loading="lazy"
              />
              <div className="road-box">
                <img
                    className="road"
                    src="assets/img/layer-4/svg/road.svg"
                    alt="road"
                    loading="lazy"
                />
                <span></span>
              </div>
              <div className="roadmap-text-box roadmap-text-box-1">
                <h3>1. 4AM Coffee Punk Launch (0-100)</h3>
                <img
                    className="island"
                    src="assets/img/layer-4/svg/island.svg"
                    alt="island"
                    loading="lazy"
                />
              </div>
              <div className="roadmap-text-box roadmap-text-box-2">
                <h3>2. Second Coffee Shop open in Mérida (Q4 - 2022)</h3>
                <img
                    className="charity-icon"
                    src="assets/img/layer-4/svg/merch.svg"
                    alt="charity-icon"
                    loading="lazy"
                />
              </div>
              <div className="roadmap-text-box roadmap-text-box-3">
                <h3>3. 4AM Coffee Punk Launch (100-200)</h3>
                <img
                    className="merch"
                    src="assets/img/layer-4/svg/charity-icon.svg"
                    alt="merch"
                    loading="lazy"
                />
              </div>
              <div className="roadmap-text-box roadmap-text-box-4">
                <h3>4. Third and Fourth Coffee Shops open in different cities in México (2023)</h3>
              </div>
            </div>
          </section>

          <section id="layer-5">
            <h1>This is a test line</h1>
            <img
                className="layer-5-bg"
                src="assets/img/layer-5/svg/layer-5-bg.svg"
                alt="layer-5-bg"
                loading="lazy"
            />
            <img
                id="vr-bros"
                src="assets/img/layer-5/svg/vr-bros.svg"
                alt="vr-bros"
                loading="lazy"
            />
            <img
                id="team-text"
                src="assets/img/layer-5/svg/team-text.svg"
                alt="team-text"
                loading="lazy"
            />
            <div id="team-container">
              <div className="team-box">
                <img
                    src="assets/img/layer-5/svg/team-4.svg"
                    alt="team-4"
                    loading="lazy"
                />
                <main>
                  <div className="team-head">
                    <h3 className="team-name">Cassiel</h3>
                    <a href="#" target="_blank">
                      <img
                          src="assets/img/layer-1/svg/twitter.svg"
                          alt="twitter"
                          loading="lazy"
                      />
                    </a>
                  </div>
                  <h4 className="team-title">- Head Barista & Anime Expert</h4>
                </main>
              </div>
              <div className="team-box">
                <img
                    src="assets/img/layer-5/svg/team-5.svg"
                    alt="team-5"
                    loading="lazy"
                />
                <main>
                  <div className="team-head">
                    <h3 className="team-name">Jorge</h3>
                    <a href="#" target="_blank">
                      <img
                          src="assets/img/layer-1/svg/twitter.svg"
                          alt="twitter"
                          loading="lazy"
                      />
                    </a>
                  </div>
                  <h4 className="team-title">Barista & Marvel Fanatic</h4>
                </main>
              </div>
              <div className="team-box">
                <img
                    src="assets/img/layer-5/svg/team-6.svg"
                    alt="team-6"
                    loading="lazy"
                />
                <main>
                  <div className="team-head">
                    <h3 className="team-name">Cris</h3>
                    <a href="#" target="_blank">
                      <img
                          src="assets/img/layer-1/svg/twitter.svg"
                          alt="twitter"
                          loading="lazy"
                      />
                    </a>
                  </div>
                  <h4 className="team-title">Marketing coffee freak</h4>
                </main>
              </div>
              <div className="team-box">
                <img
                    src="assets/img/layer-5/svg/team-7.svg"
                    alt="team-7"
                    loading="lazy"
                />
                <main>
                  <div className="team-head">
                    <h3 className="team-name">Sabino</h3>
                    <a href="#" target="_blank">
                      <img
                          src="assets/img/layer-1/svg/twitter.svg"
                          alt="twitter"
                          loading="lazy"
                      />
                    </a>
                  </div>
                  <h4 className="team-title">Cuteness advisor and front door marketing expert</h4>
                </main>
              </div>
            </div>
            <div id="night-moon-box">
              <img
                  className="moon-cloud-1"
                  src="assets/img/layer-5/svg/moon-cloud-3.svg"
                  alt="moon-cloud-1"
                  loading="lazy"
              />
              <img
                  className="moon-cloud-2"
                  src="assets/img/layer-5/svg/moon-cloud-1.svg"
                  alt="moon-cloud-2"
                  loading="lazy"
              />
              <img
                  className="moon-cloud-3"
                  src="assets/img/layer-5/svg/moon-cloud-4.svg"
                  alt="moon-cloud-3"
                  loading="lazy"
              />
              <img
                  className="moon-cloud-4"
                  src="assets/img/layer-5/svg/moon-cloud-4.svg"
                  alt="moon-cloud-4"
                  loading="lazy"
              />
              <img
                  className="moon-cloud-5"
                  src="assets/img/layer-5/svg/moon-cloud-5.svg"
                  alt="moon-cloud-5"
                  loading="lazy"
              />
              <img
                  className="moon-cloud-6"
                  src="assets/img/layer-5/svg/moon-cloud-5.svg"
                  alt="moon-cloud-5"
                  loading="lazy"
              />
              <div className="moon">
                <img
                    src="assets/img/layer-5/svg/moon.svg"
                    alt="moon"
                    loading="lazy"
                />
              </div>
            </div>
            <div id="faq">
              <img
                  id="faq-text"
                  src="assets/img/layer-5/svg/FAQ.svg"
                  alt="FAQ"
                  loading="lazy"
              />
              <div className="faq-container">
                <div className="faq-box fb-1">
                  <div className="faq-q">
                    <h6 className="babydoll">
                      1. What is an NFT?
                    </h6>
                    <img
                        src="assets/img/layer-5/svg/faq_icon.svg"
                        alt="faq_icon"
                        loading="lazy"
                    />
                  </div>
                  <div className="faq-a">
                    <p className="babydoll text-white">
                      NFT stands for “Non Fungible Token” and it refers to the first ever type of “digital
                      property”
                      we humans can own. Once you purchase an NFT the act of purchasing it gets engraved into
                      a Blockchain and will forever be there assigning ownership of that digital asset to you,
                      that is
                      until you sell it.
                    </p>
                  </div>
                </div>
                <div className="faq-box fb-2">
                  <div className="faq-q">
                    <h6 className="babydoll">
                      2. How do I buy a 4AM Coffee Punk?
                    </h6>
                    <img
                        src="assets/img/layer-5/svg/faq_icon.svg"
                        alt="faq_icon"
                        loading="lazy"
                    />
                  </div>
                  <div className="faq-a">
                    <p className="babydoll">
                      4AM Coffee Punks can be bought here on our website, unless there is a SOLD out sign. In
                      that case you will have to buy it in the secondary market at OpenSea.
                      <br/>
                      You have two ways you can buy an NFT with us at Café 4AM:
                      <br/>
                      Self-Service:
                      <br/>
                      <br/>
                      1. Convert your local money (MXN or USD usually) to a popular cryptocurrency such as
                      Bitcoin, Ethereum or USDT.
                      <br/>
                      2. Once converted, convert that cryptocurrency into $SOL, the official currency of the
                      Solana blockchain where 4AM Coffee Punks live.
                      <br/>
                      3. Once you have Solana, download the Phantom App and deposit your funds to it.
                      <br/>
                      4. With your Phantom app logged in, click the “MINT NOW” button on this website and
                      that’s it - You are ready to go!
                      <br/>
                      <br/>
                      Sounds too complicated? Let us help you.
                      <br/>
                      <br/>
                      Manual Service:
                      <br/>
                      <br/>
                      1. Download the phantom app and get your solana address like you see here.
                      <br/>
                      2. Pay for your 4AM Coffee Punk on this website using the credit card option.
                      <br/>
                      3. Café 4AM will charge an extra 10% as a processing fee.
                      <br/>
                      4. We will send your NFT to you in the next 24-48 business hours ;)
                      <br/>
                      5. Enjoy your coffee!
                    </p>
                  </div>
                </div>
                <div className="faq-box fb-3">
                  <div className="faq-q">
                    <h6 className="babydoll">3. How do I sell my NFT?</h6>
                    <img
                        src="assets/img/layer-5/svg/faq_icon.svg"
                        alt="faq_icon"
                        loading="lazy"
                    />
                  </div>
                  <div className="faq-a">
                    <p className="babydoll" style={{color: 'black'}}>
                      After your NFT’s benefits expire, you might want to go to OpenSea and list your NFT for
                      sale. There is no guarantee someone else will buy it, but you can market it yourself and
                      re-sell it on that platform or wait until someone else appears on the system! ;)
                      <br/>
                      <br/>
                      Café 4AM gets a 10% commission on every NFT resold.
                    </p>
                  </div>
                </div>
                <div className="faq-box fb-4">
                  <div className="faq-q">
                    <h6 className="babydoll">4. What can I do with my 4AM Coffee Punk NFT?</h6>
                    <img
                        src="assets/img/layer-5/svg/faq_icon.svg"
                        alt="faq_icon"
                        loading="lazy"
                    />
                  </div>
                  <div className="faq-a">
                    <p className="babydoll">
                      Use it as a profile picture, enjoy the access benefits you get, re-sell it or just hold it!
                      We
                      might have great surprises in the future for long term holders
                    </p>
                  </div>
                </div>
                <div className="faq-box fb-4">
                  <div className="faq-q">
                    <h6 className="babydoll">5. Can I buy multiple 4AM Coffee Punks at once?</h6>
                    <img
                        src="assets/img/layer-5/svg/faq_icon.svg"
                        alt="faq_icon"
                        loading="lazy"
                    />
                  </div>
                  <div className="faq-a">
                    <p className="babydoll">
                      Of course you can, you can mint up to 10 Coffee Punks at once (if available). If there is a
                      “SOLD OUT” sign anywhere on this site you might want to check our secondary market at
                      OpenSea right here.
                      <br/>
                      <br/>
                      Secret strategy: Get one Coffee Punk of each access, that way you get coffee, bagels and
                      bakery when you visit!
                    </p>
                  </div>
                </div>
                <div className="faq-box fb-4">
                  <div className="faq-q">
                    <h6 className="babydoll">6. Are you cooler than Starbucks?</h6>
                    <img
                        src="assets/img/layer-5/svg/faq_icon.svg"
                        alt="faq_icon"
                        loading="lazy"
                    />
                  </div>
                  <div className="faq-a">
                    <p className="babydoll">
                      We are local, we don’t over-roast our coffee and we love pets. We don’t know if we are
                      cooler than them but we certainly have better coffee!
                    </p>
                  </div>
                </div>
                <div className="faq-box fb-4">
                  <div className="faq-q">
                    <h6 className="babydoll">7. I have more questions, who can I talk to?</h6>
                    <img
                        src="assets/img/layer-5/svg/faq_icon.svg"
                        alt="faq_icon"
                        loading="lazy"
                    />
                  </div>
                  <div className="faq-a">
                    <p className="babydoll">
                      You can always send us a direct message via instagram at www.instagram.com/cafe4am
                      and we will be happy to help you!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <img
                className="buildings"
                src="assets/img/layer-5/svg/buildings.svg"
                alt="buildings"
                loading="lazy"
            />
            <div className="mint">
              <h1 className="sb-mint-footer">
                <Container style={{ width: '500px',height: '100px' }}>
                <Container maxWidth="xs" style={{ position: 'relative' }}>
                  <Paper
                      style={{ padding: 24, backgroundColor: '#151A1F', borderRadius: 6 }}
                  >
                    {!wallet.connected ? (
                        <ConnectButton>Connect Wallet</ConnectButton>
                    ) : (
                        <>
                          <Header candyMachine={candyMachine} />
                          <MintContainer>
                            {candyMachine?.state.isActive &&
                            candyMachine?.state.gatekeeper &&
                            wallet.publicKey &&
                            wallet.signTransaction ? (
                                <GatewayProvider
                                    wallet={{
                                      publicKey:
                                          wallet.publicKey ||
                                          new PublicKey(CANDY_MACHINE_PROGRAM),
                                      //@ts-ignore
                                      signTransaction: wallet.signTransaction,
                                    }}
                                    gatekeeperNetwork={
                                      candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                                    }
                                    clusterUrl={rpcUrl}
                                    options={{ autoShowModal: false }}
                                >
                                  <MintButton
                                      candyMachine={candyMachine}
                                      isMinting={isUserMinting}
                                      onMint={onMint}
                                  />
                                </GatewayProvider>
                            ) : (
                                <MintButton
                                    candyMachine={candyMachine}
                                    isMinting={isUserMinting}
                                    onMint={onMint}
                                />
                            )}
                          </MintContainer>
                        </>
                    )}
                  </Paper>
                </Container>

                <Snackbar
                    open={alertState.open}
                    autoHideDuration={6000}
                    onClose={() => setAlertState({ ...alertState, open: false })}
                >
                  <Alert
                      onClose={() => setAlertState({ ...alertState, open: false })}
                      severity={alertState.severity}
                  >
                    {alertState.message}
                  </Alert>
                </Snackbar>
              </Container>
              </h1>
            </div>
          </section>

          <footer className="footer">

            <img
                className="sleeping"
                src="assets/img/layer-5/svg/sleeping.svg"
                alt="sleeping"
                loading="lazy"
            />
            <div className="footer-content">
              <div className="footer-left">
                <img
                    className="footer-logo"
                    src="assets/img/layer-1/svg/sb-logo.svg"
                    alt="sb-logo"
                    loading="lazy"
                />
                <p className="babydoll">You're never alone in this journey.</p>
                <span>
              <a
                  href="https://www.instagram.com/smallbrosnft/?hl=en"
                  target="_blank"
              >
                <img
                    src="assets/img/layer-1/svg/instagram.svg"
                    alt="instagram"
                    loading="lazy"
                />
              </a>
              <a href="https://twitter.com/SmallBrosNFT" target="_blank">
                <img
                    src="assets/img/layer-1/svg/twitter.svg"
                    alt="twitter"
                    loading="lazy"
                />
              </a>
              <a href="https://medium.com/@smallbrosnft" target="_blank">
                <img
                    src="assets/img/layer-1/svg/medium.svg"
                    alt="medium"
                    loading="lazy"
                />
              </a>
            </span>
              </div>
              <div className="footer-right">
                <a className="babydoll" href="#">Home</a>
                <a className="babydoll" href="#">Coffee Punks</a>
                <a className="babydoll" href="#traits">Traits</a>
                <a className="babydoll" href="#team-container">Team</a>
                <a className="babydoll" href="#roadmap">Roadmap</a>
                <a className="babydoll" href="#faq">FAQ</a>
                <a className="babydoll" href="#">Mint</a>
              </div>
            </div>
            <i className="babydoll"
            >© Copyright 2022 • Small Bros • All rights reserved</i
            >
          </footer>
        </div>
      </div>
  );
};

export default Home;
