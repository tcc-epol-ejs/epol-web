import { ChangeEvent, useState } from 'react';
import Header from '../../components/header';

export default function Main() {
  return (
    <>
      <section className="w-full h-[100dvh]">
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>
      </section>
    </>
  );
}
