import React from "react";
import styled from "styled-components";
import { QRCode, Space } from "antd";

const PageBreakWrapper = styled.div` && { page-break-after: always; }`;
const PrintContainer = styled.div`
&&{
  // display: grid;
  // grid-template-columns: repeat(4, 1fr);
  margin: 20px;
  gap: 10px
}
`;

const PrintItem = styled.div`
&&{
  display: flex;
  height: 70vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  // border: 1px solid #000;
  box-sizing: border-box;
}
`;
export default class TemTest extends React.Component {
  render() {
    const { listCheck } = this.props;
    // const chunkedArray = listCheck.reduce((resultArray, item, index) => {
    //   const chunkIndex = Math.floor(index / 4);
    //   if (!resultArray[chunkIndex]) {
    //     resultArray[chunkIndex] = [] // start a new chunk
    //   }
    //   resultArray[chunkIndex].push(item)
    //   return resultArray
    // }, [])
    const chunkedArray = listCheck
    return (
      <div>
        <div>
          {/* <PrintContainer> */}
            {chunkedArray.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                  <PrintItem key={rowIndex}>
                    <QRCode
                      value={row.id}
                      bordered={false}
                      size={400}
                      type="svg"
                    />
                    <div style={{ marginTop: '10px' }}>
                      <h1 style={{ fontSize: '20px' }}>{row.id}</h1>
                    </div>
                  </PrintItem >
                  <PageBreakWrapper>&nbsp;</PageBreakWrapper>
              </React.Fragment>
            ))}
          {/* </PrintContainer> */}
          
        </div>
      </div>
    )
  }
}
