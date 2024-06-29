import { useRef, useState } from 'react'
import './App.css'

function App() {
    const [totalCount, setTotalCount] = useState(0)
    const [compressText, setCompressText] = useState(false)
    const neuClearFunc = useRef()
    const eosClearFunc = useRef()
    const monClearFunc = useRef()
    const basClearFunc = useRef()
    const lymClearFunc = useRef()
    function clear() {
        neuClearFunc.current()
        eosClearFunc.current()
        monClearFunc.current()
        basClearFunc.current()
        lymClearFunc.current()
        setTotalCount(0)
    }
    window.onresize = () => {
        if (window.innerWidth < 760) {
            setCompressText(true)
        } else {
            setCompressText(false)
        }
    }
    return (
        <>
            <div className='table'>
                <Column name="Neutrophils" totalCount={totalCount} setTotalCount={setTotalCount} clear={neuClearFunc} compressText={compressText} />
                <Column name="Eoshinophils" totalCount={totalCount} setTotalCount={setTotalCount} clear={eosClearFunc} compressText={compressText} />
                <Column name="Monocytes" totalCount={totalCount} setTotalCount={setTotalCount} clear={monClearFunc} compressText={compressText} />
                <Column name="Basophils" totalCount={totalCount} setTotalCount={setTotalCount} clear={basClearFunc} compressText={compressText} />
                <Column name="Lymphocyte" totalCount={totalCount} setTotalCount={setTotalCount} clear={lymClearFunc} compressText={compressText} />
                
                <Utilitys clear={clear} totalCount={totalCount} setShowSaves={setShowSaves} />
            </div>
        </>
    )
}

function Column({ name, totalCount, setTotalCount, clear, compressText = false }) {
    const [count, setCount] = useState(0)
    function btnClickHandler(incermentValue) {
        incermentValue = parseInt(incermentValue)
        if (count + incermentValue < 0) return
        setTotalCount(totalCount + incermentValue)
        setCount(count + incermentValue)
    }
    let percentage = 0.0
    if (totalCount > 0) percentage = (count / totalCount) * 100
    clear.current = () => setCount(0)
    return (
        <div className='column'>
            <div style={{ wordBreak: 'break-all' }} title={name} >{compressText ? name.slice(0, 3) + ".." : name}</div>
            <input type="number" className='count-input' value={count} onChange={e => {
                if (e.target.value === '' || isNaN(e.target.value)) e.target.value = 0
                let inputValue = parseInt(e.target.value)
                e.target.value = inputValue
                if (inputValue < 0) return
                let totalVal = totalCount;
                inputValue > totalVal ? totalVal = totalCount + (inputValue - count) : totalVal = totalCount - (count - inputValue)
                setTotalCount(totalVal)
                setCount(inputValue)
            }} />
            <Btn incermentValue={'+1'} onClickFunction={btnClickHandler} />
            <Btn incermentValue={'+2'} onClickFunction={btnClickHandler} />
            <Btn incermentValue={'+5'} onClickFunction={btnClickHandler} />
            <Btn incermentValue={'-1'} onClickFunction={btnClickHandler} />
            <Btn incermentValue={'Clear'} onClickFunction={() => clear.current()} />
            <div>{percentage.toFixed(2)}%</div>
        </div>
    )
}

function Btn({ incermentValue, onClickFunction }) {
    return (
        <button onClick={() => onClickFunction(incermentValue)}>{incermentValue}</button>
    )
}

function Utilitys({ clear, totalCount = 0, setShowSaves }) {
    return (
        <div className='column'>
            <div>Total Count</div>
            <input value={totalCount} readOnly type='number'></input>
            <button onClick={clear}>Clear All</button>
            <button onClick={() => {
                const inputs = document.querySelectorAll('.count-input')
                const textToCopy =
                    "Neutrophils: " + (inputs[0].value / totalCount) * 100 + "%\n"
                    + "Eoshinophils: " + (inputs[1].value / totalCount) * 100 + "%\n"
                    + "Monocytes: " + (inputs[2].value / totalCount) * 100 + "%\n"
                    + "Basophils: " + (inputs[3].value / totalCount) * 100 + "%\n"
                    + "Lymphocyte: " + (inputs[4].value / totalCount) * 100 + "%\n"

                navigator.clipboard.writeText(textToCopy).then(function () {
                    console.log('Text copied to clipboard');
                }).catch(function (err) {
                    console.error('Could not copy text: ', err);
                });
            }}>Copy</button>
            <button onClick={() => {
                const inputs = document.querySelectorAll('.count-input')
                let savedData = localStorage.getItem('cellCount')
                if (savedData !== null) {
                    savedData = JSON.parse(savedData)
                } else {
                    savedData = []
                }

                let currentData = []
                for (let i = 0; i < inputs.length; i++) {
                    currentData.push(inputs[i].value)
                }
                savedData.push(currentData)
                localStorage.setItem('cellCount', JSON.stringify(savedData))
            }}>Save</button>
            <button>View Save</button>
            <button onClick={() => {
                if (confirm('Are you sure you want to clear all saves?'))
                    localStorage.clear()
            }}>Clear Saves</button>
        </div>
    )
}


export default App