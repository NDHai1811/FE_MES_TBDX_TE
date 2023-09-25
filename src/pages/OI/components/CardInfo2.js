import React from 'react';
const CardInfo2 = ({ title, color, content, type, 
      style=null,
      style2 = null
    }) => {
      console.log(style);
    return (
        <React.Fragment>
            <div style={{textAlign: 'center', background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', flex:1,...style2}}>
                <div style={{ background: '#2462a3', color: '#fff', padding: '8px 0px', ...style}}>
                    {title}
                </div>
                <div style={{ textAlign: 'center', padding: type === 'text' ? '8px 0px' : '2.3px 0px', ...style2 }}>{content}</div>
            </div>
        </React.Fragment>
    )
}
export default CardInfo2