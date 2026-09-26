import type React from 'react';
import './DepartmentModal.css';
import { DEPARTMENT_MAP } from '../../constants/codeMap';
import { createPortal } from 'react-dom';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (deptCode: string) => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, onSelect }) => {
  if(!isOpen) return null;

  return createPortal(
    <div className='department-modal-overlay' onClick={onClose}>
      <div className='department-modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='department-modal-header'>
          <h3>Department Search</h3>
          <button className='modal-close-btn' onClick={onClose}>&times;</button>
        </div>

        <div className='department-modal-body'>
          <table className='department-modal-table'>
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(DEPARTMENT_MAP).map(([code,name]) => (
                <tr
                  key={code}
                  className='dept-row'
                  onClick={() => {
                    onSelect(code);
                    onClose();
                  }}
                >
                  <td style={{ textAlign: 'center' }}>{code}</td>
                  <td>{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DepartmentModal;