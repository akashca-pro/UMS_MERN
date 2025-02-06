import React from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const DeleteModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center"
      overlayClassName=""
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete this user?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
          <button
            onClick={onRequestClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
