import React, { createContext, useContext, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import DeviceDetailsModal from '../components/DeviceDetailsModal/DeviceDetailsModal';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);

    const openDeviceModal = (deviceData) => {
        setModalData(deviceData);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalData(null);
    };

    const modalHeaderTemplate = (
        <div className="uk-flex uk-flex-end uk-width-1-1">
            <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text"
                onClick={closeModal}
                style={{ 
                    color: 'var(--deep-brown)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem'
                }}
            />
        </div>
    );

    return (
        <ModalContext.Provider value={{ openDeviceModal, closeModal, modalVisible }}>
            {children}
            
            {/* Global Modal - Rendered at top level, independent of card components */}
            <Dialog
                visible={modalVisible}
                onHide={closeModal}
                header={modalHeaderTemplate}
                modal
                maximizable={false}
                closable={false}
                style={{ 
                    width: '100vw', 
                    height: '100vh',
                    margin: 0,
                    borderRadius: 0
                }}
                contentStyle={{ 
                    height: 'calc(100vh - 80px)',
                    backgroundColor: 'var(--warm-beige)',
                    padding: '30px',
                    overflow: 'auto'
                }}
                headerStyle={{
                    backgroundColor: 'var(--soft-amber)',
                    border: 'none',
                    borderBottom: '2px solid var(--deep-brown)',
                    padding: '20px'
                }}
                maskStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }}
            >
                {modalData && (
                    <DeviceDetailsModal
                        name={modalData.name}
                        location={modalData.location}
                        uuid={modalData.uuid}
                        battery={modalData.battery}
                        deviceType={modalData.deviceType}
                        additionalData={modalData.additionalData}
                        onClose={closeModal}
                    />
                )}
            </Dialog>
        </ModalContext.Provider>
    );
};

export default ModalContext;