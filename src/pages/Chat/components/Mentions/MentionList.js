import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import './MentionList.scss'

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
                                <div className="name">@{item.label}</div>
                                {/* <div className="desc">{item.description}</div> */}
                            </div>
                        </div>
                    ))
                    : <div className="mention-item">No result</div>
            }
        </div>
    )
})