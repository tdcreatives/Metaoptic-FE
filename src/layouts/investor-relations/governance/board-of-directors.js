import React from 'react';
import IRContainer from '@/layouts/investor-relations/container';
import PersonRow from '@/layouts/investor-relations/governance/person-row';
import data from '@/constants/board-of-directors.json';

const BoardOfDirectors = () => {
    const directors = data.directors || [];

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Board Of Directors
            </h2>

            <div className='mt-6 md:mt-8'>
                {directors.length === 0 ? (
                    <div className='py-12 text-center text-[#888888] futura-medium'>
                        Board of Directors information coming soon.
                    </div>
                ) : (
                    directors.map((director) => (
                        <PersonRow key={director.id} person={director} />
                    ))
                )}
            </div>
        </IRContainer>
    );
};

export default BoardOfDirectors;
