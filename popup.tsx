import { useEffect, useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"

import "./style.css"

const storage = new Storage({
  copiedKeyList: ["shield-modulation"]
})
let timer = null
function IndexPopup() {
  let [time, setTime] = useState({
    hours: 0,
    mins: 0,
    sec: 0
  })
  let [targetTime, setTargetTime] = useState({
    hours: 0,
    mins: 0
  })
  let hours = useRef(null)
  let min = useRef(null)
  let sec = useRef(null)
  let ref = useRef(null)

  async function TimeInit() {
    // let time: any = await storage.get("time")
    let time: any = localStorage.getItem("time") || "{}"
    time = JSON.parse(time)
    setTargetTime(time)
  }

  async function getTimeLocal() {
    await TimeInit()
    let now = new Date()
    let end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      targetTime.hours || 0,
      targetTime.mins || 0
    )
    if (now > end) {
      end = now
    }
    let diff = end.getTime() - now.getTime()
    setTime({
      hours: Math.floor(diff / 1000 / 60 / 60),
      mins: Math.floor((diff / 1000 / 60) % 60),
      sec: Math.floor((diff / 1000) % 60)
    })
    if (timer) clearInterval(timer)
    timer = setInterval(getTimeLocal, 1000)
  }

  useEffect(() => {
    ref.current.value = `${targetTime.hours}:${targetTime.mins}`
    getTimeLocal().catch((e) => {
      console.trace("发现错误！")
      console.error(e)
    })
  }, [targetTime.hours, targetTime.mins])
  return (
    <div className="w-[300px] h-[200px] p-5">
      <div className="join mb-2.5 w-full">
        <input
          className="input input-bordered join-item w-full"
          type="time"
          ref={ref}
          onChange={async (e) => {
            let val = e.currentTarget.value.split(":")
            let newTarget = {
              hours: parseInt(val[0]),
              mins: parseInt(val[1])
            }
            // await storage.set("time", JSON.stringify(newTarget))
            localStorage.setItem("time", JSON.stringify(newTarget))
            setTargetTime(newTarget)
          }}
        />
      </div>
      <div className="daojishi grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span ref={hours} style={{ "--value": time.hours } as any}></span>
          </span>
          hours
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span ref={min} style={{ "--value": time.mins } as any}></span>
          </span>
          min
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span ref={sec} style={{ "--value": time.sec } as any}></span>
          </span>
          sec
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
