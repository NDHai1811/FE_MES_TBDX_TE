import { QrcodeOutlined } from "@ant-design/icons";
import { Button, Input, AutoComplete, Modal } from "antd";
import { useEffect, useState } from "react";
import ScanQR from "../Scanner";
import { useRef } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const ScanButton = (props) => {
  const {
    onScan = null,
    placeholder,
    searchData = [],
    height = null,
    isReset = false,
    onReset = null,
  } = props;
  const location = useLocation();
  const [options, setOptions] = useState([]);
  const inputRef = useRef();
  const searchResult = (query) => {
    const result = searchData.filter((e) =>
      e?.name?.toLowerCase().includes(query?.toLowerCase())
    );
    return result.map((e) => {
      return { value: e.id, label: e.name };
    });
  };
  const handleSearch = (value) => {
    setOptions(value ? searchResult(value) : []);
  };
  const onSelect = (value) => {
    if (searchData.some((e) => e.id === value)) {
      onScan(value);
    }
  };
  useEffect(() => {
    setValue("");
  }, [location]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isScan, setIsScan] = useState(0);
  const handleCloseMdl = () => {
    setIsOpenModal(false);
    setIsScan(2);
  };
  useEffect(() => {
    if (isScan === 1) {
      setIsOpenModal(true);
    } else if (isScan === 2) {
      setIsOpenModal(false);
    }
  }, [isScan]);
  const [value, setValue] = useState("");
  const onChange = (event) => {
    setValue(event.target.value);
    if (!event.target.value) {
      onReset && onReset();
    }
  };
  // useEffect(()=>{
  //     setValue()
  // })
  return (
    <>
      {/* <AutoComplete
            style={{
                width: '100%',
            }}
            value={value}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            onChange={setValue}
        > */}
      <Input
        ref={inputRef}
        allowClear
        size="large"
        prefix={
          <QrcodeOutlined
            style={{ fontSize: "24px", height: height, marginRight: "10px" }}
            onClick={() => {
              inputRef.current.focus();
              setValue("");
              setIsScan(1);
            }}
          />
        }
        placeholder={placeholder ?? "Nhập mã pallet hoặc quét mã QR"}
        value={value}
        onPressEnter={() => {
          // setValue(value);
          // if(!searchData.some(e=>e.id === value)){
          value && onScan(value);
          setValue("");
          // }
        }}
        onChange={onChange}
      />
      {/* </AutoComplete> */}
      {isOpenModal && (
        <Modal
          title="Quét QR"
          open={isOpenModal}
          onCancel={handleCloseMdl}
          footer={null}
        >
          <ScanQR
            isScan={isOpenModal}
            onResult={(res) => {
              setValue(res);
              onScan(res);
              setIsOpenModal(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default ScanButton;
