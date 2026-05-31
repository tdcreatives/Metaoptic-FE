import React from 'react';
import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import '@/layouts/investor-relations/ir-scroll.scss';

export default function InvestorRelationsLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
