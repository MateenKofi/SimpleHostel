import React from 'react';
import RoomAssignment from './RoomAssignment';
import Modal from '../../../components/Modal';

interface AssignRoomModalProps {
  residentId: string;
  onClose: () => void;
}

const AssignRoomModal = ({ residentId, onClose }: AssignRoomModalProps) => {
  return (
    <Modal modalId='assign_room_modal' onClose={onClose}>
            <div className="flex-1 overflow-y-auto">
              <RoomAssignment 
                residentId={residentId} 
                onComplete={onClose}
              />
            </div>
        </Modal>
  );
};

export default AssignRoomModal; 