import { Modal } from "antd";

// ...
const ModalDetail = ({ selectedModel, setSelectedModel }) => {
  return (
    <Modal
      title={selectedModel}
      open={selectedModel !== null}
      onCancel={() => setSelectedModel(null)}
      footer={null}
      centered
    >
      <p>Information about {selectedModel}</p>
    </Modal>
  );
};

export default ModalDetail;
