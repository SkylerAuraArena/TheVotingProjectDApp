import { useRef } from 'react'
import useMainContext from '../../contexts/MainContext/useMainContext';
import Ledger from '../ledger/ClosedLedger';
import VotingDevice from '../votingDevice/VotingDevice';
import css from './Booth.module.css';

const Booth = () => {

    const { enableLedger } = useMainContext()

    const curtainRef = useRef(null)
    const frontPanelRef = useRef(null)
    const backPanelRef = useRef(null)
    const ledgerRef = useRef(null)

    const sceneCss = `flexJIC w-100 h-100 ${css.scene}`
    const closedCurtainCss = `h-90% cursor-pointer transform translate-x-0 scale-100`

    const frontPanel = `${css.box__face} ${css.box__face_front}`;
    const backPanel = `${css.box__face} ${css.box__face_back}`;
    const rightPanel = `${css.box__face} ${css.box__face_right} ${css.box__face__color_side}`;
    const leftPanel = `${css.box__face} ${css.box__face_left} ${css.box__face__color_side}`;
    const topPanel = `${css.box__face} ${css.box__face_top} ${css.box__face__color_side}`;
    const bottomPanel = `${css.box__face} ${css.box__face_bottom}`;

    const changeCurtain = () => {
        const cssCurtain = curtainRef.current.className;
        if(cssCurtain === closedCurtainCss) {
            curtainRef.current.className = "hidden";
            backPanelRef.current.className = "";
            ledgerRef.current.className = "hidden";
            enableLedger(true);

        } else {
            curtainRef.current.className = closedCurtainCss;
            backPanelRef.current.className = "hidden";
            ledgerRef.current.className = "";
            enableLedger(false);
        }
    };
    
  return (
    <div className={sceneCss}>
        <div className={css.box}>
            <div ref={frontPanelRef} className={frontPanel}>
                <img ref={curtainRef} src="http://talkerscode.com/webtricks/demo/images/curtain1.jpg" id="leftCurtain" className={closedCurtainCss} alt='leftCurtain' onClick={() => changeCurtain()}/>
                <div ref={backPanelRef} className="hidden">
                    <VotingDevice changeCurtain={changeCurtain} />
                </div>
                <div ref={ledgerRef}>
                    <Ledger />
                </div>
            </div>
            <div className={backPanel}>
            </div>
            <div className={rightPanel}></div>
            <div className={leftPanel}></div>
            <div className={topPanel}></div>
            <div className={bottomPanel}></div>
        </div>
    </div>
  )
}

export default Booth