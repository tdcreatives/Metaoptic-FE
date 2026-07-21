import React from 'react';

import Header from '@/layouts/main/header';
import ProductCameraModules from '@/layouts/product-camera-modules';
import Footer from '@/layouts/main/footer';

const CameraModulesClientSide = () => {
    return (
        <>
            <Header />
            <ProductCameraModules />
            <Footer />
        </>
    );
};

export default CameraModulesClientSide;
