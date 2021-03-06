import React from 'react'
import style from './style.module.css'
export default function ChatHeader(props) {
  return (
    <div className={style.content}>
      <img className={style.avatar} src={props.data.avatar} alt='user photo'/>
      <div className={style.desc_area}>
        <span className={style.nickname}>{props.data.nickname}</span>
        <span className={style.sologan}>{props.data.desc}</span>
      </div>
    </div>
  )
}

ChatHeader.propTypes = {}
