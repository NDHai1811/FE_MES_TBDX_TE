import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import './MentionList.scss'
import { Avatar } from 'antd'
import { fullNameToColor } from '../../chat_helper'

export const MentionList = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = index => {
        const item = props.items[index]

        if (item) {
            props.command(item)
        }
    }

    const upHandler = () => {
        setSelectedIndex(((selectedIndex + props.items.length) - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }

            if (event.key === 'Enter') {
                enterHandler()
                return true
            }

            return false
        },
    }))

    return (
        <div className="mention-popup">
            {
                props.items.length
                    ? props.items.map((item, index) => (
                        <div
                            key={item.id}
                            className={`mention-item ${index === selectedIndex ? 'active' : ''}`}
                            onClick={() => selectItem(index)}
                        >
                            {item.avatar && <img src={item.avatar} className="avatar" alt='' />}
                            <div className="info" style={{ alignContent: 'center' }}>
                                <div className="name d-flex gap-2 align-items-center">
                                    <Avatar size={33} src={item.avatar} style={{ backgroundColor: fullNameToColor(item?.name) }}>
                                        {item?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                                    </Avatar>
                                    {item?.name}
                                </div>
                                {/* <div className="desc">{item.description}</div> */}
                            </div>
                        </div>
                    ))
                    : <div className="mention-item">No result</div>
            }
        </div>
    )
})