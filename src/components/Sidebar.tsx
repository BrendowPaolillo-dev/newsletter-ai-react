import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface SidebarProps {
  isOpen: boolean;
  items: {
    title: string;
    caption?: string;
    icon: IconProp;
    link?: string;
    btnAction?: string;
    separator?: boolean;
  }[];
  onClose: () => void;
  onAction: (action: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, items, onClose, onAction }) => {
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarProps['items'][0]) => {
    if (item.btnAction) {
      onAction(item.btnAction);
    } else if (item.link) {
      navigate(item.link);
      onClose();
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform`}
    >
      {/* Botão de Fechar */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        onClick={onClose}
      >
        <FontAwesomeIcon icon="times" />
      </button>

      {/* Lista de Itens */}
      <ul className="mt-12">
        {items.map((item, index) => (
          <li key={index} className={`p-4 ${item.separator ? 'border-t' : ''}`}>
            <button
              className="w-full text-left flex items-center space-x-4"
              onClick={() => handleItemClick(item)}
            >
              <FontAwesomeIcon icon={item.icon} className="text-gray-600" />
              <div>
                <p className="font-bold">{item.title}</p>
                {item.caption && <p className="text-sm text-gray-500">{item.caption}</p>}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
