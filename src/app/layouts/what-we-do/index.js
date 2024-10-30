const WhatWeDo = () => {
    return (
        <div className='w-full bg-what-we-do py-[18.5vh] flex flex-col justify-center items-center overflow-hidden bg-contain bg-repeat-round'>
            <p
                className='futura-book text-white uppercase tracking-widest'
                style={{
                    fontSize: 'calc((85.4 / 1920) * 100vw)', // ≈ 4.45vw
                    lineHeight: 'calc((85.4 / 1920) * 100vw)', // ≈ 4.45vw
                }}>
                What we do
            </p>
            <div className='text-white futura-book text-center mt-[4vh] text-[1.8vw]'>
                <p>At Metaoptics Technologies, we are breaking through</p>
                <p>current lens limitations in consumer and IoT</p>
                <p>applications. Our high-throughput meta lens</p>
                <p>production ensures efficiency and cost-effectiveness.</p>
                <p>As AR/VR and HUD technologies rapidly expands, our</p>
                <p>innovative meta lens are essential to provide</p>
                <p>miniaturization in supporting this market growth.</p>
            </div>
        </div>
    );
};

export default WhatWeDo;
